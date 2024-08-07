CREATE TABLE Conversations (
id UUID DEFAULT uuid_generate_v4(),
timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
pinnedOrder INTEGER,
gptOnly BOOLEAN DEFAULT FALSE,
PRIMARY KEY(id)
);

alter table Conversations enable row level security;

create policy "public can read Conversations"
on public.Conversations
for select to anon
using (true);

create policy "public can write Conversations"
on public.Conversations
for update to anon
using (true);

create policy "public can insert Conversations"
on public.Conversations
for insert to anon
with
check (true);

create policy "public can delete Conversations"
on public.Conversations
for DELETE to anon
using (true);

INSERT INTO Conversations (timestamp, gptOnly)
VALUES ('2023-01-10T06:00:00.000Z', TRUE);

CREATE TABLE GPTs (
id UUID DEFAULT uuid_generate_v4(),
name VARCHAR NOT NULL,
icon TEXT NOT NULL,
defaultModel VARCHAR NOT NULL,
timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
description TEXT NOT NULL,
conversation UUID NOT NULL REFERENCES Conversations(id),
PRIMARY KEY(id)
);

alter table GPTs enable row level security;

create policy "public can read GPTs"
on public.GPTs
for select to anon
using (true);

create policy "public can write GPTs"
on public.GPTs
for update to anon
using (true);

create policy "public can insert GPTs"
on public.GPTs
for insert to anon
with
check (true);

create policy "public can delete GPTs"
on public.GPTs
for DELETE to anon
using (true);

## --------Get conversation id first before insert

INSERT INTO GPTs (conversation, defaultModel, name, description, timestamp, icon)
VALUES ('ID from conversation <-----------------------' , 'gpt-4o-mini', 'Basic', 'Basic context, no tunning', '2023-01-10T06:00:00.000Z', '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28"/></svg>');

CREATE TABLE Messages (
id UUID DEFAULT uuid_generate_v4(),
role VARCHAR CHECK(role IN ('assistant', 'function', 'system', 'tool', 'user')) NOT NULL,
model VARCHAR NOT NULL,
content TEXT NOT NULL,
timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
context BOOLEAN NOT NULL,
originalcontext BOOLEAN NOT NULL,
GPT UUID REFERENCES GPTs(id),
conversation UUID REFERENCES Conversations(id),
PRIMARY KEY(id)
);

alter table Messages enable row level security;

create policy "public can read Messages"
on public.Messages
for select to anon
using (true);

create policy "public can write Messages"
on public.Messages
for update to anon
using (true);

create policy "public can insert Messages"
on public.Messages
for insert to anon
with
check (true);

create policy "public can delete Messages"
on public.Messages
for DELETE to anon
using (true);

## --------Get conversation and GPT id first before insert

INSERT INTO
Messages (
id,
ROLE,
CONTENT,
TIMESTAMP,
context,
originalcontext,
GPT,
conversation,
model
)
VALUES
(
uuid_generate_v4 (),
'system',
'You are a helpful assistant.',
'2023-01-10T06:00:00.000Z',
TRUE,
TRUE,
'GPT id <------------',
'conversation id <------------',
'gpt-4o-mini'
),
(
uuid_generate_v4 (),
'assistant',
'Hello! How can I assist you today?',
'2023-01-10T06:01:00.000Z',
TRUE,
TRUE,
'GPT id <------------',
'conversation id <------------',
'gpt-4o-mini'
);
