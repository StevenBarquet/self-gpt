import { useAppLogicStore } from 'src/store/appLogic';

export function usePanelActions() {
  // -----------------------CONSTS, HOOKS, STATES
  const { update, GPTs, Conversations } = useAppLogicStore();
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  function onClickGpt(id: string) {
    const gpt = GPTs.find((e) => e.id === id);
    update({
      mainScreen: 'gptConversation',
      selectedModel: gpt?.default_model,
      selectedGpt: id,
      selectedConversation: undefined, // Limpia previa conversación seleccionada
      panelTab: 'gpts', // Swichea a la tab del panel "gpts"
      aiAnswer: '', // Limpia la última respuesta del chat
    });
  }
  function onClickConversation(id: string) {
    const conversation = Conversations.find((e) => e.id === id);
    const gpt = GPTs.find((e) => e.id === conversation?.gpt_base);

    update({
      mainScreen: 'chat',
      selectedModel: gpt?.default_model,
      selectedGpt: undefined,
      selectedConversation: id, // Limpia previa conversación seleccionada
      panelTab: 'chats', // Swichea a la tab del panel "chats"
      aiAnswer: '', // Limpia la última respuesta del chat
    });
  }
  function onCreateGpt() {
    update({
      mainScreen: 'gptCreate',
      selectedGpt: undefined,
      selectedConversation: undefined,
      aiAnswer: '',
    });
  }
  // -----------------------HOOK DATA
  return {
    onClickGpt,
    onClickConversation,
    onCreateGpt,
  };
}
