create table if not exists issac_guest_book (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists issac_guest_book_created_idx on issac_guest_book (created_at desc);

alter table issac_guest_book enable row level security;
-- No policies — default-deny. All access via the edge function using service role.
