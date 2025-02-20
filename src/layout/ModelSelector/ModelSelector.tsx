// ---Dependencies
import React, { useEffect } from 'react';
// ---Styles
import style from './ModelSelector.module.scss';
import { Select } from 'antd';
import { Message } from 'src/database/Messages/definitions';
import { useAppLogicStore } from 'src/store/appLogic';

export const modelOptions: {
  value: Message['model'];
  label: string;
  title: string;
}[] = [
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    title:
      'Cheapest and fast model. It is multimodal (accepting text or image inputs and outputting text), has higher intelligence than gpt-3.5-turbo but is just as fast.',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    title:
      'Our versatile, high-intelligence flagship model for complex, multi-step tasks. GPT-4o is cheaper and faster than GPT-4 Turbo. Currently points to gpt-4o-2024-05-13.',
  },
  {
    value: 'o3-mini',
    label: 'O3 mini',
    title:
      'o3-mini is our most recent small reasoning model, providing high intelligence at the same cost and latency targets of o1-mini. o3-mini also supports key developer features.',
  },
  {
    value: 'o1',
    label: 'O1',
    title:
      'The o1 reasoning model is designed to solve hard problems across domains. o1-mini is a faster and more affordable reasoning model',
  },
];

/**
 * ModelSelector Component:  Descripción del comportamiento...
 */
export function ModelSelector() {
  // -----------------------CONSTS, HOOKS, STATES
  const { selectedModel, update, allMessages } = useAppLogicStore();
  useEffect(() => copyLastModel(), [allMessages]);
  // -----------------------MAIN METHODS
  const onChange = (value: Message['model']) => {
    update({ selectedModel: value });
  };

  // /**Copia el modelo del último mensaje al siguiente prompt */
  function copyLastModel() {
    let conversationModel = modelOptions[0].value;
    if (allMessages?.length) {
      conversationModel = allMessages[allMessages.length - 1].model;
    }
    update({ selectedModel: conversationModel });
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['ModelSelector']}>
      <Select
        placeholder='Select a person'
        optionFilterProp='label'
        value={selectedModel}
        onChange={onChange}
        options={modelOptions}
      />
    </div>
  );
}
