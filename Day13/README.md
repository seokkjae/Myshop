# Day 13 — 예약 관리자 페이지 + API 키 환경변수화

## 무엇이 바뀌었나
- `Day05/index.html` 의 하드코딩된 Supabase URL/anon 키를 **제거**하고, 예약 저장을 서버리스 함수 `/api/reserve` 호출로 변경.
- 비밀번호로 보호되는 **관리자 페이지** `Day13/admin.html` 추가 (배포 시 `/admin` 으로도 접근).
- 관리 작업은 `/api/admin` 함수가 **service_role 키**로 처리(RLS 우회). 키는 서버 환경변수에만 존재.

## 파일
- `api/reserve.js` — 공개 예약 접수(POST). anon 키 사용.
- `api/admin.js` — 목록(GET)/상태·메모 수정(PATCH)/삭제(DELETE). service_role + 비밀번호.
- `Day13/admin.html` — 관리자 대시보드.
- `Day13/update_status_note.sql` — status 기본값/제약 설정 SQL.
- `vercel.json` — `/admin` → `/Day13/admin.html` rewrite.

## 설정 순서
1. **Supabase**: `Day13/update_status_note.sql` 을 SQL Editor 에서 실행.
2. **환경변수**: Vercel → Project → Settings → Environment Variables 에 추가
   (Production·Preview·Development 모두 체크). 값은 `.env.example` 참고.
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`
   - service_role 키: Supabase → Project Settings → API → `service_role`.
3. **로컬 실행** (서버리스 함수는 단순히 파일을 여는 방식으론 동작하지 않음):
   ```bash
   npm i -g vercel      # 최초 1회
   vercel link          # 프로젝트 연결
   vercel env pull      # .env 생성
   vercel dev           # http://localhost:3000
   ```
4. **배포**: `vercel --prod` 또는 git push (Vercel 자동 배포).

## 동작 확인
- `/Day05/index.html` 예약 제출 → Supabase 에 `status='대기'` 행 생성. 페이지 소스에 키 없음.
- `/admin` 접속 → 비밀번호 입력 → 목록·통계 표시, 상태 변경·메모 저장·취소/삭제 동작.

> 참고: 예약 삭제는 되돌릴 수 없으므로 보통은 **"예약 취소"(status='취소')** 사용을 권장합니다.
