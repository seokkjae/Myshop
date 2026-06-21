-- =============================================================
-- Day13 — reservations 테이블에 status / note 운영 설정
-- (status·note 컬럼은 이미 추가되어 있다고 가정. Supabase SQL Editor 에서 1회 실행)
--
-- status 값: 대기 / 확정 / 완료 / 취소  (신규 예약 = 대기)
-- =============================================================

-- 신규 예약 기본값을 '대기' 로 (서버 함수도 '대기'를 직접 넣지만 안전하게 기본값도 지정)
alter table public.reservations alter column status set default '대기';

-- 기존에 status 가 비어 있던 행 백필
update public.reservations set status = '대기' where status is null;

-- 허용된 값만 들어오도록 제약 (선택)
alter table public.reservations
  drop constraint if exists reservations_status_check;
alter table public.reservations
  add constraint reservations_status_check
  check (status in ('대기','확정','완료','취소'));
