// ---Dependencies
import React from "react";
import { useAppLogicStore } from "src/store/appLogic";
import { useSelection } from "src/utils/hooks/useSelection";
import { PanelTitle } from "../common/PanelTitle/PanelTitle";
import { usePanelActions } from "../usePanelActions";
import { GptCard } from "./GptCard/GptCard";
import { GptFooter } from "./GptFooter/GptFooter";
// ---Styles
import style from "./Gpts.module.scss";

/**
 * Gpts Component:  Descripción del comportamiento...
 */
export function Gpts() {
	// -----------------------CONSTS, HOOKS, STATES
	const { GPTs, selectedGpt } = useAppLogicStore();
	const { selectedIds, isSelected, toggleSelectAll, toggleSelectOne } =
		useSelection(GPTs);
	const {
		onClickGpt,
		onBatchDeleteGpt,
		onCreateGpt,
		onDeleteGpt,
		onEditGpt,
		onIncreaseGptOrder,
	} = usePanelActions(selectedIds);

	// -----------------------MAIN METHODS
	// -----------------------AUX METHODS
	// -----------------------RENDER
	return (
		<div className={style["Gpts"]}>
			<PanelTitle title="Select all" toggleSelectAll={toggleSelectAll} />
			{GPTs.map((e, i) => (
				<GptCard
					key={`GptCard-${i}`}
					{...e}
					onClickGpt={onClickGpt}
					isActive={selectedGpt === e.id}
					isFirst={i === 0}
					isCheckSelected={isSelected(e.id)}
					toggleSelectOne={toggleSelectOne}
					onDelete={onDeleteGpt}
					onEditGpt={onEditGpt}
					onIncreaseGptOrder={onIncreaseGptOrder}
				/>
			))}
			<GptFooter
				selectedIds={selectedIds}
				onBatchDeleteGpt={onBatchDeleteGpt}
				onCreateGpt={() => onCreateGpt(null)}
			/>
		</div>
	);
}
