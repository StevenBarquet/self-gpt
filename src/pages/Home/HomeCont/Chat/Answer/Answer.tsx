// ---Dependencies
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// ---Styles
import style from './Answer.module.scss';
import { UpdatePanel } from '../common/UpdatePanel/UpdatePanel';
import { WithId } from 'src/utils/functions/typesUtils';
import { Message } from 'src/database/Messages/definitions';
import { CopyButton } from 'src/common/CopyButton/CopyButton';

interface Props {
  message?: WithId<Message>;
  aiAnswer?: string;
  reloadChatMsgs: () => void;
}

/**
 * Answer Component:
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Answer({ message, aiAnswer, reloadChatMsgs }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  if (!message && !aiAnswer) return null;
  const text = aiAnswer || message!.content; // Necesita recibir aiAnswer o Message
  const formated = !!text.length ? formatText(text) : null;
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!formated) return null;
  return (
    <div className={style['Answer']}>
      <section>
        {formated.map((e, i) => (
          <React.Fragment key={`${i}-Answer-Fragment`}>
            <SyntaxHighlighter key={`${i}-SyntaxHighlighter`} language={e.language} style={e.theme}>
              {e.text}
            </SyntaxHighlighter>
            {e.language !== 'markdown' ? (
              <CopyButton key={`${i}-CopyButton`} toCopy={e.text.trim()} />
            ) : null}
          </React.Fragment>
        ))}
      </section>
      {message ? <UpdatePanel reloadChatMsgs={reloadChatMsgs} message={message} /> : null}
    </div>
  );
}

type Fragment = {
  language: string;
  text: string;
  theme: {
    [key: string]: React.CSSProperties;
  };
};

function formatText(input: string): Fragment[] {
  const fragments: Fragment[] = [];

  // Regex para capturar bloques de código con el lenguaje y texto
  const codeBlockRegex = /```(\w+)\s([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  // Traversing the string
  while ((match = codeBlockRegex.exec(input)) !== null) {
    // Porción de texto antes del bloque de código
    if (match.index > lastIndex) {
      fragments.push({
        language: 'markdown',
        text: input.slice(lastIndex, match.index).trim(),
        theme: docco,
      });
    }

    // Bloque de código formateado
    fragments.push({
      language: match[1],
      text: match[2].trim(),
      theme: a11yDark,
    });

    // Actualizar el índice para continuar después del bloque de código
    lastIndex = match.index + match[0].length;
  }

  // Fragmento de texto después del último bloque de código
  if (lastIndex < input.length) {
    fragments.push({
      language: 'markdown',
      text: input.slice(lastIndex).trim(),
      theme: docco,
    });
  }

  return fragments.filter((fragment) => fragment.text.length > 0);
}
