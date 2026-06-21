// 모닝브루 예약 관리 — Vercel 서버리스 함수 (비밀번호 보호)
// GET    /api/admin            예약 목록 조회 (최신순)
// PATCH  /api/admin {id,status?,note?}   상태/메모 수정
// DELETE /api/admin {id}       예약 영구 삭제 (UI 기본은 status='취소' 소프트 처리, 하드삭제는 보조)
//
// service_role 키로 PostgREST 를 호출해 RLS 를 우회한다. 이 키는 절대 브라우저로 보내지 않는다.
// 모든 요청은 x-admin-password 헤더를 env 의 ADMIN_PASSWORD 와 대조해 인증한다.

const ALLOWED_STATUS = ['대기', '확정', '완료', '취소'];

module.exports = async (req, res) => {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!SUPABASE_URL || !SERVICE_KEY || !ADMIN_PASSWORD) {
    console.error('환경변수 누락: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / ADMIN_PASSWORD');
    return res.status(500).json({ error: '서버 설정 오류' });
  }

  // ── 인증 ──────────────────────────────────────────────
  const given = req.headers['x-admin-password'];
  if (!given || given !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: '인증 실패' });
  }

  const rest = `${SUPABASE_URL}/rest/v1/reservations`;
  const authHeaders = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
  };

  // 본문 파싱 (문자열 방어)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  try {
    // ── 목록 조회 ──────────────────────────────────────
    if (req.method === 'GET') {
      const resp = await fetch(`${rest}?select=*&order=created_at.desc`, {
        headers: authHeaders,
      });
      if (!resp.ok) {
        console.error('Supabase select 실패:', resp.status, await resp.text());
        return res.status(502).json({ error: '목록을 불러오지 못했습니다.' });
      }
      const rows = await resp.json();
      return res.status(200).json({ ok: true, reservations: rows });
    }

    // ── 상태/메모 수정 ─────────────────────────────────
    if (req.method === 'PATCH') {
      const id = Number(body.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'id 가 필요합니다.' });
      }
      const patch = {};
      if (body.status !== undefined) {
        if (!ALLOWED_STATUS.includes(body.status)) {
          return res.status(400).json({ error: '허용되지 않은 상태값입니다.' });
        }
        patch.status = body.status;
      }
      if (body.note !== undefined) {
        patch.note = body.note === null ? null : String(body.note);
      }
      if (Object.keys(patch).length === 0) {
        return res.status(400).json({ error: '수정할 내용이 없습니다.' });
      }

      const resp = await fetch(`${rest}?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...authHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(patch),
      });
      if (!resp.ok) {
        console.error('Supabase update 실패:', resp.status, await resp.text());
        return res.status(502).json({ error: '수정에 실패했습니다.' });
      }
      return res.status(200).json({ ok: true });
    }

    // ── 영구 삭제 ──────────────────────────────────────
    if (req.method === 'DELETE') {
      const id = Number(body.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: 'id 가 필요합니다.' });
      }
      const resp = await fetch(`${rest}?id=eq.${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders, Prefer: 'return=minimal' },
      });
      if (!resp.ok) {
        console.error('Supabase delete 실패:', resp.status, await resp.text());
        return res.status(502).json({ error: '삭제에 실패했습니다.' });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('admin 처리 중 예외:', err);
    return res.status(500).json({ error: '잠시 후 다시 시도해주세요.' });
  }
};
