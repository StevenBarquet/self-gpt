// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './GptCard.module.scss';
import { WithId } from 'src/utils/functions/typesUtils';
import { GPT } from 'src/database/GPTs/definitions';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import { Button, Tooltip } from 'antd';
import { Icon } from '@iconify/react';
import { useAppLogicStore } from 'src/store/appLogic';

interface Props extends WithId<GPT> {}

/**
 * GptCard Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function GptCard({ icon, name, description, defaultModel, conversation }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const [visible, setVisible] = useState(false);
  const { update } = useAppLogicStore();
  // -----------------------MAIN METHODS
  const showTooltip = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 5000); // Oculta el tooltip después de 8 segundos
  };
  function onClickGpt() {
    update({
      mainScreen: 'gptConversation',
      selectedContext: conversation,
      selectedModel: defaultModel,
    });
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['GptCard']}>
      <Tooltip title={description}>
        <Button onClick={onClickGpt} type='text' className='gptBtn'>
          <DynamicIcon icon={icon} />
          <section>
            <h5>{name}</h5>
            <p>{description}</p>
          </section>
        </Button>
      </Tooltip>
      <div className='options'>
        <Button danger type='text'>
          <Icon icon='bi:trash-fill' />
        </Button>
        <Tooltip title={description} visible={visible}>
          <Button onClick={showTooltip} type='text'>
            <Icon icon='memory:tooltip-above-help' />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
