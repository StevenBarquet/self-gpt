import { ICreateGptValues } from 'src/pages/Home/HomeCont/CreateGpt/useCreateGptForm';
import { useAppInfoStore } from 'src/store/appInfo';
import { useAppLogicStore } from 'src/store/appLogic';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm } from 'src/utils/functions/alertUtils';

export function usePanelActions(selectedIds: string[]) {
  // -----------------------CONSTS, HOOKS, STATES
  const { update, GPTs, Conversations } = useAppLogicStore();
  const { deleteGpt, batchDeleteGpt, getGpt, updateGpt, populateGpts } = useSupabase();
  const { toggleCollapsed, isMobile } = useAppInfoStore();

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
    if (isMobile) toggleCollapsed();
  }

  async function onEditGpt(id: string) {
    const gpt = await getGpt(id);
    if (!gpt) throw new Error('GPT not found');
    onCreateGpt(null, {
      gptId: gpt.id,
      icon: gpt.icon,
      name: gpt.name,
      default_model: gpt.default_model,
      description: gpt.description,
      context: JSON.stringify(
        gpt.original_context.map((e) => ({ role: e.role, content: e.content })),
        null,
        2,
      ),
    });
  }

  async function onIncreaseGptOrder(id: string) {
    const currentIndex = GPTs.findIndex((e) => e.id === id);
    const gpt = GPTs[currentIndex];
    const higherGpt = GPTs[currentIndex - 1];

    const promiseList = [
      updateGpt(gpt.id, { timestamp: higherGpt.timestamp }),
      updateGpt(higherGpt.id, { timestamp: gpt.timestamp }),
    ];
    await Promise.all(promiseList);
    await populateGpts();
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
    if (isMobile) toggleCollapsed();
  }
  function onCreateGpt(_clickEvent: any, createGptInit?: ICreateGptValues) {
    update({
      mainScreen: 'gptCreate',
      selectedGpt: undefined,
      selectedConversation: undefined,
      aiAnswer: '',
      createGptInit,
    });
    if (isMobile) toggleCollapsed();
  }
  const onDeleteGpt = (id: string) => {
    swalApiConfirm({
      callback: async () => {
        update({ mainScreen: 'empty' });
        await deleteGpt(id);
      },
      successMsg: 'GPT deleted successfully',
    });
  };

  const onBatchDeleteGpt = () => {
    swalApiConfirm({
      callback: async () => {
        await batchDeleteGpt(selectedIds);
      },
      successMsg: 'Selection deleted successfully',
    });
  };
  // -----------------------HOOK DATA
  return {
    onClickGpt,
    onClickConversation,
    onCreateGpt,
    onDeleteGpt,
    onBatchDeleteGpt,
    onEditGpt,
    onIncreaseGptOrder,
  };
}
