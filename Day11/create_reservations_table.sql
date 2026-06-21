-- =============================================================
-- 모닝브루 픽업 예약 폼 — 설문/예약 저장 테이블
-- Supabase SQL Editor 에 붙여넣고 실행하세요.
-- 폼 필드: 이름 · 연락처 · 메뉴 · 픽업 날짜 · 픽업 시간 · 인원수
-- =============================================================

-- 1) 예약(설문) 테이블 생성 ------------------------------------
create table if not exists public.reservations (
  id          bigint generated always as identity primary key,
  name        text        not null,                 -- 이름
  phone       text        not null,                 -- 연락처
  menu        text        not null,                 -- 메뉴 (핸드드립 커피 / 오늘의 원두 / 수제 스콘 / 계절 과일 에이드)
  pickup_date date        not null,                 -- 픽업 날짜
  pickup_time time        not null,                 -- 픽업 시간
  people      integer     not null default 1,       -- 인원수
  created_at  timestamptz not null default now(),   -- 접수 시각
  constraint reservations_people_check check (people >= 1),
  constraint reservations_menu_check check (
    menu in ('핸드드립 커피', '오늘의 원두', '수제 스콘', '계절 과일 에이드')
  )
);

comment on table public.reservations is '모닝브루 픽업 예약 폼 접수 내용';

-- 최근 접수/날짜별 조회를 위한 인덱스
create index if not exists reservations_created_at_idx on public.reservations (created_at desc);
create index if not exists reservations_pickup_date_idx on public.reservations (pickup_date);

-- 2) Row Level Security (RLS) ---------------------------------
-- 공개 폼에서 anon 키로 INSERT 는 허용하되, 조회/수정/삭제는 막습니다.
alter table public.reservations enable row level security;

-- 익명 방문자(anon)·로그인 사용자(authenticated) 모두 예약 접수(INSERT) 허용
drop policy if exists "Allow public insert" on public.reservations;
create policy "Allow public insert"
  on public.reservations
  for insert
  to anon, authenticated
  with check (true);

-- (선택) 관리자만 service_role 키로 전체 조회 가능 — anon 키로는 SELECT 불가
-- service_role 은 RLS 를 우회하므로 별도 SELECT 정책 없이도 대시보드/서버에서 조회됩니다.
