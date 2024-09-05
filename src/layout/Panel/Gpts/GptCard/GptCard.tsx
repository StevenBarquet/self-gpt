// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './GptCard.module.scss';
import { WithId } from 'src/utils/functions/typesUtils';
import { GPT } from 'src/database/GPTs/definitions';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import { Button, Checkbox, Tooltip } from 'antd';
import { Icon } from '@iconify/react';

interface Props extends WithId<GPT> {
  onClickGpt: (id: string) => void;
  isActive: boolean;
  isCheckSelected: boolean;
  toggleSelectOne: (id: string) => void;
}

/**
 * GptCard Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function GptCard({
  icon,
  name,
  description,
  id,
  isActive,
  onClickGpt,
  isCheckSelected,
  toggleSelectOne,
}: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const [visible, setVisible] = useState(false);
  // -----------------------MAIN METHODS
  const showTooltip = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 5000); // Oculta el tooltip después de 8 segundos
  };
  function onClick() {
    onClickGpt(id);
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['GptCard']}>
      <Checkbox checked={isCheckSelected} onClick={() => toggleSelectOne(id)} />
      <Tooltip title={description}>
        <Button
          onClick={onClick}
          type='text'
          className={`gptBtn ${isActive ? 'gptBtn-active' : ''}`}
        >
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
