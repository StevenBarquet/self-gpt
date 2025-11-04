// ---Dependencies
import React from 'react';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { Message } from 'src/database/Messages/definitions';
import type { WithId } from 'src/utils/functions/typesUtils';
import { UpdatePanel } from '../common/UpdatePanel/UpdatePanel';
// ---Styles
import style from './Answer.module.scss';
import {
  CodeBlock,
  LatexBlock,
  MarkdownBlock,
  StreamingAnswer,
} from './FormattedSegments/FormattedSegments';

interface Props {
  message?: WithId<Message>;
  aiAnswer?: string;
  reloadChatMsgs: () => void;
}

export const Answer = React.memo(function Answer({ message, aiAnswer, reloadChatMsgs }: Props) {
  const isStreaming = !!aiAnswer && !message;

  // Streaming: no formatear
  if (isStreaming) {
    return (
      <div className={style['Answer']}>
        <section>
          <StreamingAnswer text={aiAnswer!} />
        </section>
      </div>
    );
  }

  // Estático (ya terminado): parsear una sola vez
  if (!message) return null;
  const text = message.content;

  const fragments = React.useMemo(() => formatTextOnce(text), [text]); // ver versión optimizada abajo

  return (
    <div className={style['Answer']}>
      <section>
        {fragments.map((e, i) => (
          <React.Fragment key={`frag-${i}`}>
            {e.language === 'markdown' ? (
              <MarkdownBlock text={e.text} />
            ) : (
              <>
                {e.language === 'latex' ? (
                  <LatexBlock text={e.text} />
                ) : (
                  <CodeBlock language={e.language} text={e.text} />
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </section>
      <UpdatePanel reloadChatMsgs={reloadChatMsgs} borderles message={message} />
    </div>
  );
});

type Fragment = {
  language: string;
  text: string;
  theme: {
    [key: string]: React.CSSProperties;
  };
};

function formatTextOnce(input: string): Fragment[] {
  const out: Fragment[] = [];
  // Acepta ```lang\n ... ``` o ```\n ... ```
  const re = /```([^\n`]*)\n([\s\S]*?)```/g;

  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(input)) !== null) {
    if (m.index > last) {
      out.push({
        language: 'markdown',
        text: input.slice(last, m.index), // sin trim
        theme: docco,
      });
    }
    const lang = (m[1] || '').trim() || 'text';
    out.push({
      language: lang,
      text: m[2], // sin trim
      theme: atomOneDark,
    });
    last = m.index + m[0].length;
  }

  if (last < input.length) {
    out.push({
      language: 'markdown',
      text: input.slice(last), // sin trim
      theme: docco,
    });
  }

  // Solo filtra vacíos reales
  return out.filter((f) => f.text.length > 0);
}
