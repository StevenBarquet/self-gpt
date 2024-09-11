// ---Dependencies
import React from 'react';
// ---Styles
import style from './Gpts.module.scss';
import { useAppLogicStore } from 'src/store/appLogic';
import { GptCard } from './GptCard/GptCard';
import { usePanelActions } from '../usePanelActions';
import { useSelection } from 'src/utils/hooks/useSelection';
import { PanelTitle } from '../common/PanelTitle/PanelTitle';
import { GptFooter } from './GptFooter/GptFooter';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm } from 'src/utils/functions/alertUtils';

/**
 * Gpts Component:  Descripción del comportamiento...
 */
export function Gpts() {
  // -----------------------CONSTS, HOOKS, STATES
  const { GPTs, selectedGpt, update } = useAppLogicStore();
  const { onClickGpt } = usePanelActions();
  const { selectedIds, isSelected, toggleSelectAll, toggleSelectOne } = useSelection(GPTs);

  const { deleteGpt } = useSupabase();

  // -----------------------MAIN METHODS
  const onDelete = (id: string) => {
    swalApiConfirm({
      callback: async () => {
        update({ mainScreen: 'empty' });
        await deleteGpt(id);
      },
      successMsg: 'GPT deleted successfully',
    });
  };
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Gpts']}>
      <PanelTitle title='Select all' toggleSelectAll={toggleSelectAll} />
      {GPTs.map((e, i) => (
        <GptCard
          key={`GptCard-${i}`}
          {...e}
          onClickGpt={onClickGpt}
          isActive={selectedGpt === e.id}
          isCheckSelected={isSelected(e.id)}
          toggleSelectOne={toggleSelectOne}
          onDelete={onDelete}
        />
      ))}
      <GptFooter selectedIds={selectedIds} />
    </div>
  );
}
