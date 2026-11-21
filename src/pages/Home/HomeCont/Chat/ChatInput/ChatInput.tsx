// ---Dependencies
import { Button, ConfigProvider, Slider, Switch, type ThemeConfig } from 'antd';
import type { KeyboardEvent, ReactElement, RefObject } from 'react';
import type { Message } from 'src/database/Messages/definitions';
import type { useInput } from 'src/utils/hooks/useInput';
import type { WithId } from 'src/utils/functions/typesUtils';
// ---Components
import { Icon } from '@iconify/react';
import { Spinner } from 'src/common/Spinner/Spinner';
// ---Config
import {
  type EffortOption,
  GEMINI_EFFORTS,
  getModelProvider,
  modelSupportsEffort,
  OPEN_AI_EFFORTS,
} from 'src/SUPPORTED_MODELS';
import { useAppInfoStore } from 'src/store/appInfo';
import { useAppLogicStore } from 'src/store/appLogic';
import { usePreferencesStore } from 'src/store/preferences';
// ---Styles
import style from './ChatInput.module.scss';

const ACCENT_COLOR = '#2c67c5';
const ACCENT_HOVER = '#3d7ad8';

/** Color de acento compartido por el botón de enviar, el switch de contexto y el slider de effort */
const INPUT_THEME: ThemeConfig = {
  token: { colorPrimary: ACCENT_COLOR },
  components: {
    Slider: {
      trackBg: ACCENT_COLOR,
      trackHoverBg: ACCENT_HOVER,
      handleColor: ACCENT_COLOR,
      handleActiveColor: ACCENT_HOVER,
      dotActiveBorderColor: ACCENT_COLOR,
      railBg: 'rgba(255, 255, 255, 0.18)',
      railHoverBg: 'rgba(255, 255, 255, 0.28)',
      dotBorderColor: 'rgba(255, 255, 255, 0.28)',
    },
  },
};

interface Props extends ReturnType<typeof useInput> {
  chatLoading?: boolean;
  sdkLoading?: boolean;
  stopGeneration: () => void;
  ondAsk: () => void;
  cancelEdit: () => void;
  editingMessageRef: RefObject<WithId<Message> | null>;
  ctxCtlr: {
    value: boolean;
    lastCtxCheck: boolean | undefined;
    toggle: () => void;
  };
}

export function ChatInput({
  onChange,
  value,
  chatLoading,
  sdkLoading,
  stopGeneration,
  ondAsk,
  cancelEdit,
  editingMessageRef,
  ctxCtlr,
}: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { isMobile, menuCollapsed } = useAppInfoStore();
  // Selector: no re-renderizar con cada flush de aiAnswer durante el streaming
  const selectedModel = useAppLogicStore((s) => s.selectedModel);
  const { openAiEffort, geminiEffort, update: updatePreferences } = usePreferencesStore();
  const isGemini = getModelProvider(selectedModel) === 'gemini';
  const supportsEffort = modelSupportsEffort(selectedModel);
  const fullIsLoading = chatLoading || sdkLoading;
  const isEditing = !!editingMessageRef.current;
  const canSend = !!value?.length;
  const panelWidth = menuCollapsed ? (isMobile ? 20 : 80) : isMobile ? 0 : 470;

  // -----------------------MAIN METHODS
  function onKeyPress(event: KeyboardEvent<unknown>) {
    if (isMobile) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      ondAsk();
    }
  }

  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <ConfigProvider theme={INPUT_THEME}>
      <div className={style.ChatInput} style={{ left: panelWidth + 35 }}>
        {isEditing && (
          <div className="editingIndicator">
            <Icon icon="mdi:pencil" />
            <span>Editing message</span>
            <Button type="text" size="small" onClick={cancelEdit} aria-label="Cancel edit">
              <Icon icon="mdi:close" />
            </Button>
          </div>
        )}

        {fullIsLoading ? (
          <div className="spinnerContainer">
            <Spinner displayMessage={''} />
          </div>
        ) : (
          <textarea
            className="textarea"
            value={value}
            onChange={onChange as any}
            placeholder="Ask me anything..."
            onKeyDown={onKeyPress}
            rows={1}
          />
        )}

        <div className="toolbar">
          <div className="controls">
            <div className="keepInContext">
              <label htmlFor="keepInContext">Context</label>
              <Switch
                id="keepInContext"
                size="small"
                defaultChecked={ctxCtlr.lastCtxCheck}
                checked={ctxCtlr.value}
                onClick={ctxCtlr.toggle}
              />
            </div>

            {supportsEffort &&
              (isGemini ? (
                <EffortSlider
                  key="gemini"
                  options={GEMINI_EFFORTS}
                  value={geminiEffort}
                  onChange={(geminiEffort) => updatePreferences({ geminiEffort })}
                />
              ) : (
                <EffortSlider
                  key="openai"
                  options={OPEN_AI_EFFORTS}
                  value={openAiEffort}
                  onChange={(openAiEffort) => updatePreferences({ openAiEffort })}
                />
              ))}
          </div>

          <Button
            className="sendBtn"
            onClick={sdkLoading ? stopGeneration : ondAsk}
            type="primary"
            shape="circle"
            disabled={!sdkLoading && !canSend}
            aria-label={sdkLoading ? 'Stop generation' : 'Send'}
          >
            {sdkLoading ? <Icon icon="si:stop-fill" /> : <Icon icon="mingcute:arrow-up-fill" />}
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}

interface EffortSliderProps<V extends string> {
  options: readonly EffortOption<V>[];
  value: V;
  onChange: (value: V) => void;
}

/** Slider de effort genérico: el índice del slider se traduce al valor del proveedor */
function EffortSlider<V extends string>({ options, value, onChange }: EffortSliderProps<V>) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  return (
    <div className="effort">
      <Icon icon="mdi:brain" className="effortIcon" />
      <span className="effortLabel">Effort</span>
      <Slider
        className="effortSlider"
        min={0}
        max={options.length - 1}
        step={1}
        dots
        value={index}
        onChange={(i) => onChange(options[i].value)}
        tooltip={{ open: false }}
        aria-label="Effort"
      />
      <span className="effortValue">{options[index].label}</span>
    </div>
  );
}
