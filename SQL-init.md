CREATE TABLE GPTs (
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  icon TEXT NOT NULL,
  defaultModel VARCHAR NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO GPTs (defaultModel, name, description, timestamp, icon)
VALUES ('gpt-4o-mini', 'Basic', 'Basic context, no tunning', '2023-01-10T06:00:00.000Z', '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M18.38 27.94v-14.4l11.19-6.46c6.2-3.58 17.3 5.25 12.64 13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m18.38 20.94l12.47-7.2l11.19 6.46c6.2 3.58 4.1 17.61-5.23 17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 17.44l12.47 7.2v12.93c0 7.16-13.2 12.36-17.86 4.28"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="M30.5 21.2v14.14L19.31 41.8c-6.2 3.58-17.3-5.25-12.64-13.33"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m30.5 27.94l-12.47 7.2l-11.19-6.46c-6.21-3.59-4.11-17.61 5.22-17.61"/><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m24.44 31.44l-12.47-7.2V11.31c0-7.16 13.2-12.36 17.86-4.28"/></svg>');

CREATE TABLE Conversations (
  id UUID DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  pinnedOrder INTEGER,
  PRIMARY KEY(id)
);
INSERT INTO Conversations (timestamp)
VALUES ('2023-01-10T06:00:00.000Z');

CREATE TABLE Messages (
  id UUID DEFAULT uuid_generate_v4(),
  role VARCHAR CHECK(role IN ('assistant', 'function', 'system', 'tool', 'user')) NOT NULL,
  model VARCHAR NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  context BOOLEAN NOT NULL,
  originalContext BOOLEAN NOT NULL,
  GPT UUID REFERENCES GPTs(id),
  conversation UUID REFERENCES Conversations(id),
  PRIMARY KEY(id)
);

INSERT INTO
  Messages (
    id,
    ROLE,
    CONTENT,
    TIMESTAMP,
    context,
    originalContext,
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
    '2f7f2e3c-c651-4987-bb6e-d86120c53192',
    '2312f098-49d2-4108-80f9-babd102cd51a',
    'gpt-4o-mini'
  ),
  (
    uuid_generate_v4 (),
    'assistant',
    'Hello! How can I assist you today?',
    '2023-01-10T06:01:00.000Z',
    TRUE,
    TRUE,
    '2f7f2e3c-c651-4987-bb6e-d86120c53192',
    '2312f098-49d2-4108-80f9-babd102cd51a',
    'gpt-4o-mini'
  );