// ---Dependencies
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import katex from 'katex';
// ---Styles
import style from './Answer.module.scss';
import { UpdatePanel } from '../common/UpdatePanel/UpdatePanel';
import { WithId } from 'src/utils/functions/typesUtils';
import { Message } from 'src/database/Messages/definitions';
import { CopyButton } from 'src/common/CopyButton/CopyButton';

// Componente para el mensaje en streaming: sin parseo ni highlight
const StreamingAnswer = React.memo(function StreamingAnswer({ text }: { text: string }) {
  return <pre className='StreamingAnswer'>{text}</pre>;
});

const CodeBlock = React.memo(
  function CodeBlock({ language, text }: { language: string; text: string }) {
    return (
      <>
        <SyntaxHighlighter
          language={language || 'text'}
          style={atomOneDark}
          showLineNumbers={false}
          wrapLongLines
          PreTag='pre'
          CodeTag='code'
        >
          {text}
        </SyntaxHighlighter>
        <CopyButton toCopy={text} />
      </>
    );
  },
  (prev, next) => prev.language === next.language && prev.text === next.text,
);

const LatexBlock = React.memo(function LatexBlock({ text }: { text: string }) {
  const html = katex.renderToString(text, {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <>
      <div className={'LatexBlock'} dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton toCopy={text} />
    </>
  );
});

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
              <div style={{ whiteSpace: 'pre-wrap' }}>{e.text}</div>
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
      <UpdatePanel reloadChatMsgs={reloadChatMsgs} message={message} />
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
