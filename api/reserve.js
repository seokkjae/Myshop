// 모닝브루 공개 예약 접수 — Vercel 서버리스 함수
// POST /api/reserve
// Day05/index.html 예약 폼이 호출한다. Supabase 키는 이 서버 함수의 env 에만 존재하고,
// 브라우저에는 노출되지 않는다. 의존성 없이 Supabase PostgREST 를 fetch 로 직접 호출한다.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('환경변수 누락: SUPABASE_URL / SUPABASE_ANON_KEY');
    return res.status(500).json({ error: '서버 설정 오류' });
  }

  // Vercel 은 보통 JSON 본문을 자동 파싱하지만, 문자열로 들어오는 경우도 방어한다.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const menu_preference = String(body.menu_preference || '').trim();
  const time = String(body.time || '').trim();
  const count = Number(body.count);

  // 서버측 재검증 (클라이언트 검증을 신뢰하지 않는다)
  if (!name || !phone || !menu_preference || !time) {
    return res.status(400).json({ error: '필수 항목이 비어 있습니다.' });
  }
  if (!Number.isFinite(count) || count < 1) {
    return res.status(400).json({ error: '인원수는 1명 이상이어야 합니다.' });
  }

  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([{
        name,
        phone,
        menu_preference,
        time,
        count: Math.floor(count),
        status: '대기',
      }]),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Supabase insert 실패:', resp.status, detail);
      return res.status(502).json({ error: '저장에 실패했습니다.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('예약 저장 중 예외:', err);
    return res.status(500).json({ error: '잠시 후 다시 시도해주세요.' });
  }
};
