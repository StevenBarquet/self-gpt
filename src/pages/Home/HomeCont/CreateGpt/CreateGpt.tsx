// ---Dependencies

import { Icon } from '@iconify/react';
import { Button, Tabs, type TabsProps } from 'antd';
import { useState } from 'react';
import { Fcol, Frow } from 'react-forge-grid';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import { FBasicInput } from 'src/common/Formctlr/Formik/FBasicInput/FBasicInput';
import { FBasicSelect } from 'src/common/Formctlr/Formik/FBasicSelect/FBasicSelect';
import { FBasicTextArea } from 'src/common/Formctlr/Formik/FBasicTextArea/FBasicTextArea';
import { modelOptions } from 'src/layout/ModelSelector/ModelSelector';
import { swalApiError, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
import { basicResponsive } from 'src/utils/functions/responsiveUtils';
import { ContextChat } from './ContextChat/ContextChat';
// ---Styles
import style from './CreateGpt.module.scss';
import { useCreateGptForm } from './useCreateGptForm';
import { type ContextMode, validateContext } from './validations';

const CONTEXT_TABS: TabsProps['items'] = [
  { key: 'json', label: 'JSON', icon: <Icon icon='vscode-icons:file-type-json' /> },
  { key: 'chat', label: 'Chat', icon: <Icon icon='mdi:chat-processing-outline' /> },
];

/**
 * CreateGpt Component:  Descripción del comportamiento...
 */
export function CreateGpt() {
  // -----------------------CONSTS, HOOKS, STATES
  const [icon, setIcon] = useState('Your icon should apear here');
  const {
    formik,
    contextMode,
    onChangeContextMode,
    onAddContextMessage,
    onDeleteContextMessage,
    onClearContextMessages,
  } = useCreateGptForm();
  const hasIcon = formik.values.icon.length > 0;
  const hasJSON = formik.values.context.length > 0;
  const isEdit = !!formik.values.gptId;
  const isJsonMode = contextMode === 'json';
  // -----------------------MAIN METHODS
  function onValidateContext() {
    const validation = validateContext(formik.values.context);

    if (validation.isError) {
      swalApiError(`${validation.errMessage} ❌❌❌`);
    } else {
      swalApiSuccessAuto('Context JSON is valid ✅✅✅');
    }
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Frow vAlign='middle' className={style['CreateGpt']} hSpace={5}>
      <Fcol {...basicResponsive(25)}>
        <FBasicInput
          formik={formik}
          valueName='name'
          label='Title'
          placeholder='Short name for your GPT'
        />
      </Fcol>
      <Fcol {...basicResponsive(75)}>
        <FBasicInput
          label='Description'
          formik={formik}
          valueName='description'
          placeholder='Describe what your GPT is good for'
        />
      </Fcol>
      <Fcol {...basicResponsive(25)}>
        <FBasicSelect
          label='Model'
          formik={formik}
          valueName='default_model'
          placeholder='Select model'
          options={modelOptions}
        />
      </Fcol>
      <Fcol {...basicResponsive(35)}>
        <FBasicInput label='Icon' formik={formik} valueName='icon' placeholder='Valid SVG icon' />
      </Fcol>
      <Fcol {...basicResponsive(40)}>
        <div className='hint'>
          <span>Hint:</span> You can use{' '}
          <a href='https://icon-sets.iconify.design/' target='_blank' rel='noopener noreferrer'>
            iconify
          </a>{' '}
          to look for icons (once you found one copy the svg code){' '}
        </div>
      </Fcol>
      <Fcol>
        <div className='validate'>
          <Button disabled={!hasIcon} onClick={() => setIcon(formik.values.icon)}>
            Validate Icon ✅
          </Button>
          <span>{hasIcon ? <DynamicIcon icon={icon} /> : icon}</span>
        </div>
      </Fcol>
      <Fcol>
        <h3>Context</h3>
      </Fcol>
      <Fcol>
        <Tabs
          centered
          activeKey={contextMode}
          items={CONTEXT_TABS}
          onChange={(key) => onChangeContextMode(key as ContextMode)}
        />
      </Fcol>
      {isJsonMode ? (
        <>
          <Fcol {...basicResponsive(50)}>
            <div className='hint'>
              <p>
                <span>Hint:</span> The relevant and more important think in your GPT.
              </p>
              <p>
                Context is a previous conversation that the chat will be based on every time you
                create a Chat based on this GPT.
              </p>
              <p>
                Your context should be in JSON format and must follow the following schema{' '}
                <span>-{'>'}</span>
              </p>
            </div>
          </Fcol>
          <Fcol {...basicResponsive(50)}>
            <SyntaxHighlighter language='JSON' style={atomOneDark}>
              {`[\n  { "role": "user", "content": "your context here" }, \n  { "role": "assistant", "content": "your context here" }\n]`}
            </SyntaxHighlighter>
            <pre></pre>
          </Fcol>
          <Fcol {...basicResponsive(80)}>
            <FBasicTextArea
              formik={formik}
              valueName='context'
              placeholder='Your JSON here'
              inputStyle={{ minHeight: 200 }}
            />
          </Fcol>
          <Fcol {...basicResponsive(20)} style={{ textAlign: 'center' }}>
            <Button
              onClick={onValidateContext}
              disabled={!hasJSON}
              icon={<Icon icon='vscode-icons:file-type-json' />}
            >
              Validate JSON
            </Button>
          </Fcol>
        </>
      ) : (
        <>
          <Fcol>
            <div className='hint'>
              <p>
                <span>Hint:</span> Build the previous conversation your GPT will start from, one
                message at a time. Use <span>System</span> for instructions, <span>User</span> for
                what the user says and <span>Assistant</span> for how your GPT should answer.
              </p>
            </div>
          </Fcol>
          <Fcol>
            <ContextChat
              formik={formik}
              onAddMessage={onAddContextMessage}
              onDeleteMessage={onDeleteContextMessage}
              onClearMessages={onClearContextMessages}
            />
          </Fcol>
        </>
      )}
      <Fcol>
        <Button
          style={{ width: '80%', margin: '20px auto', display: 'block' }}
          type='primary'
          block
          icon={<Icon icon='uil:create-dashboard' />}
          onClick={formik.submitForm}
        >
          {isEdit ? 'Update GPT' : 'Create'}
        </Button>
      </Fcol>
    </Frow>
  );
}
