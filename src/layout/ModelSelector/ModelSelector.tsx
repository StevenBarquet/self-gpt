// ---Dependencies

import { Select } from 'antd';
import { useEffect } from 'react';
import type { Message } from 'src/database/Messages/definitions';
import { SUPPORTED_MODELS } from 'src/SUPPORTED_MODELS';
import { useAppLogicStore } from 'src/store/appLogic';
// ---Styles
import style from './ModelSelector.module.scss';

export const modelOptions = SUPPORTED_MODELS;

/**
 * ModelSelector Component:  Descripción del comportamiento...
 */
export function ModelSelector() {
  // -----------------------CONSTS, HOOKS, STATES
  const { selectedModel, update, allMessages, mainScreen } = useAppLogicStore();
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
  if (mainScreen === 'empty' || mainScreen === 'gptCreate') return null;
  return (
    <div className={style['ModelSelector']}>
      <Select
        placeholder='Select a model'
        optionFilterProp='label'
        value={selectedModel}
        onChange={onChange}
        options={modelOptions}
      />
    </div>
  );
}
