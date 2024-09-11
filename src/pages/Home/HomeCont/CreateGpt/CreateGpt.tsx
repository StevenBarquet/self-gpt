// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './CreateGpt.module.scss';
import { LabelGridInput } from 'src/common/Formctlr/LabelGridInput/LabelGridInput';
import { FBasicInput } from 'src/common/Formctlr/Formik/FBasicInput/FBasicInput';
import { useCreateGptForm } from './useCreateGptForm';
import { Fcol, Frow } from 'react-forge-grid';
import { basicResponsive } from 'src/utils/functions/responsiveUtils';
import { Button } from 'antd';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import { FBasicSelect } from 'src/common/Formctlr/Formik/FBasicSelect/FBasicSelect';
import { modelOptions } from 'src/layout/ModelSelector/ModelSelector';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FBasicTextArea } from 'src/common/Formctlr/Formik/FBasicTextArea/FBasicTextArea';
import { Icon } from '@iconify/react';
import { validateContext } from './validations';
import { swalApiError, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
/**
 * CreateGpt Component:  Descripción del comportamiento...
 */
export function CreateGpt() {
  // -----------------------CONSTS, HOOKS, STATES
  const [icon, setIcon] = useState('Your icon should apear here');
  const { formik } = useCreateGptForm();
  const hasIcon = formik.values.icon.length > 0;
  const hasJSON = formik.values.context.length > 0;
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
    <Frow vAlign='middle' className={style['CreateGpt']}>
      <LabelGridInput colProps={basicResponsive(25)} label='Title'>
        <FBasicInput formik={formik} valueName='name' placeholder='Short name for your GPT' />
      </LabelGridInput>
      <LabelGridInput label='Description' colProps={basicResponsive(75)}>
        <FBasicInput
          formik={formik}
          valueName='description'
          placeholder='Describe what your GPT is good for'
        />
      </LabelGridInput>
      <LabelGridInput
        colProps={basicResponsive(15)}
        label='Model'
        labelGrid={{ span: 40 }}
        inputGrid={{ span: 60 }}
      >
        <FBasicSelect
          formik={formik}
          valueName='defaultmodel'
          placeholder='Select model'
          options={modelOptions}
        />
      </LabelGridInput>
      <LabelGridInput label='Icon' colProps={basicResponsive(35)}>
        <FBasicInput formik={formik} valueName='icon' placeholder='Valid SVG icon' />
      </LabelGridInput>
      <Fcol {...basicResponsive(50)}>
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
      <Fcol {...basicResponsive(50)}>
        <div className='hint'>
          <p>
            <span>Hint:</span> The relevant and more important think in your GPT.
          </p>
          <p>
            Context is a previous conversation that the chat will be based on every time you create
            a Chat based on this GPT.
          </p>
          <p>
            Your context should be in JSON format and must follow the following schema{' '}
            <span>-{'>'}</span>
          </p>
        </div>
      </Fcol>
      <Fcol {...basicResponsive(50)}>
        <SyntaxHighlighter language='JSON' style={docco}>
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
      <Fcol>
        <Button
          style={{ width: '80%', margin: '20px auto', display: 'block' }}
          type='primary'
          block
          icon={<Icon icon='uil:create-dashboard' />}
          onClick={formik.submitForm}
        >
          Create
        </Button>
      </Fcol>
    </Frow>
  );
}
