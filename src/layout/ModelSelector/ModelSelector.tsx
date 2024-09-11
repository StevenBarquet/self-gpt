// ---Dependencies
import React from 'react';
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
      'Our high-intelligence flagship model for complex, multi-step tasks. GPT-4o is cheaper and faster than GPT-4 Turbo. Currently points to gpt-4o-2024-05-13.',
  },
];

/**
 * ModelSelector Component:  Descripción del comportamiento...
 */
export function ModelSelector() {
  // -----------------------CONSTS, HOOKS, STATES
  const { selectedModel, update } = useAppLogicStore();
  // -----------------------MAIN METHODS
  const onChange = (value: Message['model']) => {
    update({ selectedModel: value });
  };
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
