// ---Dependencies
import React, { useEffect } from 'react';
// ---Styles
import style from './ModelSelector.module.scss';
import { Select } from 'antd';
import { Message } from 'src/database/Messages/definitions';
import { useAppLogicStore } from 'src/store/appLogic';
import { SUPPORTED_MODELS } from 'src/SUPPORTED_MODELS';

export const modelOptions = SUPPORTED_MODELS;

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
        placeholder='Select a model'
        optionFilterProp='label'
        value={selectedModel}
        onChange={onChange}
        options={modelOptions}
      />
    </div>
  );
}
