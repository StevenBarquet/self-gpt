----------------1st Query: gpts ---------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE gpts (
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  name VARCHAR NOT NULL,
  icon TEXT NOT NULL,
  default_model VARCHAR NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL
);

alter table
  gpts enable row level security;

create policy "public can read gpts" on public.gpts for
select
  to anon using (true);

create policy "public can write gpts" on public.gpts for
update
  to anon using (true);

create policy "public can insert gpts" on public.gpts for
insert
  to anon with check (true);

create policy "public can delete gpts" on public.gpts for DELETE to anon using (true);

INSERT INTO
  gpts (
    default_model,
    name,
    description,
    timestamp,
    icon
  )
VALUES
  (
    'gpt-4o-mini',
    'Basic',
    'Basic context, no tunning',
    '2023-01-10T06:00:00.000Z',
    '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28"/></svg>'
  );

----------------2nd Query: conversations ---------------
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  pinned_order INTEGER,
  gpt_only BOOLEAN DEFAULT FALSE,
  name TEXT,
  gpt_base UUID NOT NULL REFERENCES gpts (id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

alter table
  conversations enable row level security;

create policy "public can read conversations" on public.conversations for
select
  to anon using (true);

create policy "public can write conversations" on public.conversations for
update
  to anon using (true);

create policy "public can insert conversations" on public.conversations for
insert
  to anon with check (true);

create policy "public can delete conversations" on public.conversations for DELETE to anon using (true);

INSERT INTO
  conversations (TIMESTAMP, gpt_only, gpt_base)
VALUES
  (
    '2023-01-10T06:00:00.000Z',
    TRUE,
    (
      SELECT
        id
      FROM
        gpts
      LIMIT
        1
    )
  );

----------------3rd Query: messages ---------------
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  role VARCHAR CHECK(
    role IN (
      'assistant',
      'function',
      'system',
      'tool',
      'user'
    )
  ) NOT NULL,
  content TEXT NOT NULL,
  model VARCHAR NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  context BOOLEAN NOT NULL,
  original_context BOOLEAN NOT NULL,
  gpt UUID NOT NULL REFERENCES gpts (id) ON DELETE CASCADE,
  conversation UUID NOT NULL REFERENCES conversations (id) ON DELETE CASCADE
);

alter table
  messages enable row level security;

create policy "public can read messages" on public.messages for
select
  to anon using (true);

create policy "public can write messages" on public.messages for
update
  to anon using (true);

create policy "public can insert messages" on public.messages for
insert
  to anon with check (true);

create policy "public can delete messages" on public.messages for DELETE to anon using (true);

INSERT INTO
  messages (
    role,
    CONTENT,
    TIMESTAMP,
    context,
    original_context,
    model,
    gpt,
    conversation
  )
VALUES
  (
    'system',
    'You are a helpful assistant.',
    '2023-01-10T06:00:00.000Z',
    TRUE,
    TRUE,
    'gpt-4o-mini',
    (
      SELECT
        id
      FROM
        gpts
      LIMIT
        1
    ), (
      SELECT
        id
      FROM
        conversations
      LIMIT
        1
    )
  ), (
    'assistant', 'Hello! How can I assist you today?', '2023-01-10T06:01:00.000Z', TRUE,
    TRUE,
    'gpt-4o-mini',
    (
      SELECT
        id
      FROM
        gpts
      LIMIT
        1
    ), (
      SELECT
        id
      FROM
        conversations
      LIMIT
        1
    )
  );