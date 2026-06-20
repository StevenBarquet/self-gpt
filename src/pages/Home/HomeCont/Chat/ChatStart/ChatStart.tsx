// ---Dependencies
import type { ReactElement } from 'react';
// ---Components
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
// ---Config
import type { WithId } from 'src/utils/functions/typesUtils';
import type { GPT } from 'src/database/GPTs/definitions';
// ---Styles
import style from './ChatStart.module.scss';

interface Props {
  gpt: WithId<GPT>;
}

export function ChatStart({ gpt }: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['ChatStart']}>
      <DynamicIcon icon={gpt.icon} />
      <h1>{gpt.name}</h1>
      <p>{gpt.description}</p>
    </div>
  );
}
