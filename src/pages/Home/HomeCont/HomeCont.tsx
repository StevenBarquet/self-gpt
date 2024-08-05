// ---Dependencys
import { ReactElement, useState } from 'react';
import style from './HomeCont.module.scss';
import { RoutingRules } from 'src/providers/RoutingRules/RoutingRules';
import { Layout } from 'src/layout/Layout';
import { Icon } from '@iconify/react';
import { Button, Input } from 'antd';
import { useInput } from 'src/utils/hooks/useInput';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import OpenAI from 'openai';
import { useKeysStore } from 'src/store/keys';

/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const [icon, setIcon] = useState('');
  const { onChange, value } = useInput();
  const { OPEN_AI_API_KEY } = useKeysStore();
  // -----------------------MAIN METHODS
  async function onValidateGpt() {
    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

    try {
      const stream = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
        model: 'gpt-3.5-turbo',
      });
      console.log(stream);
    } catch (error: any) {
      console.log(error);
    }
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Layout>
      <RoutingRules className={style['HomeCont']}>
        <Input value={value} onChange={onChange} />
        <Button
          onClick={() => {
            setIcon(value);
            onValidateGpt();
          }}
        >
          Cambiar
        </Button>
        <br />
        <span>Dangerously Set Inner HTML:</span>
        <DynamicIcon icon={icon} />
      </RoutingRules>
    </Layout>
  );
}
