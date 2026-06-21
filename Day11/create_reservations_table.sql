-- =============================================================
-- 모닝브루 픽업 예약 폼 — reservations 테이블
-- Supabase SQL Editor 에 붙여넣고 실행하세요.
--
-- 폼(Day05/index.html)이 전송하는 컬럼명과 정확히 일치시킵니다:
--   name(이름) · phone(연락처) · menu_preference(원하는 메뉴)
--   · time(희망 시간) · count(인원)
--
-- ⚠️ 아래는 기존 reservations 테이블을 '재생성'합니다.
--    (현재 데이터 0건 확인됨 — 안전. 실데이터가 쌓인 뒤에는 실행하지 마세요.)
-- =============================================================

-- 1) 기존 테이블 제거 후 재생성 -------------------------------
drop table if exists public.reservations cascade;

create table public.reservations (
  id              bigint generated always as identity primary key,
  name            text        not null,                -- 이름
  phone           text        not null,                -- 연락처
  menu_preference text        not null,                -- 원하는 메뉴
  "time"          text        not null,                -- 희망 시간 (예: "08:30")
  count           integer     not null default 1,      -- 인원
  created_at      timestamptz not null default now(),  -- 접수 시각
  constraint reservations_count_check check (count >= 1)
);

comment on table public.reservations is '모닝브루 픽업 예약 폼 접수 내용';

create index if not exists reservations_created_at_idx on public.reservations (created_at desc);

-- 2) Row Level Security (RLS) ---------------------------------
-- 공개 폼이므로 anon 키로 INSERT 는 허용하고, 그 외(조회/수정/삭제)는 막습니다.
alter table public.reservations enable row level security;

drop policy if exists "Allow public insert" on public.reservations;
create policy "Allow public insert"
  on public.reservations
  for insert
  to anon, authenticated
  with check (true);

-- 관리자(service_role)는 RLS 를 우회하므로 대시보드/서버에서 전체 조회가 가능합니다.
