// ---Dependencies

import { Icon } from "@iconify/react";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import React, { useEffect } from "react";
import { Spinner } from "src/common/Spinner/Spinner";
import { useAppLogicStore } from "src/store/appLogic";
import { useSupabase } from "src/utils/app/useSupabase";
import { Chats } from "./Chats/Chats";
import { Gpts } from "./Gpts/Gpts";
// ---Styles
import style from "./Panel.module.scss";

/**
 * Panel Component:  Descripción del comportamiento...
 */
export function Panel() {
	// -----------------------CONSTS, HOOKS, STATES
	const { populateGpts, populateConversations, isLoading } = useSupabase();
	const { update, GPTs, panelTab } = useAppLogicStore();
	useEffect(() => initialPopulate(), []);

	const items: TabsProps["items"] = [
		{
			key: "gpts",
			label: (
				<div className="tabTitle">
					GPTs <Icon icon="carbon:area-custom" />
				</div>
			),
			children: isLoading ? <Spinner /> : <Gpts />,
		},
		{
			key: "chats",
			label: (
				<div className="tabTitle">
					Chats <Icon icon="heroicons-outline:chat" />
				</div>
			),
			children: isLoading ? <Spinner /> : <Chats />,
		},
	];
	// -----------------------MAIN METHODS
	const onChange = (key: string) => {
		update({ panelTab: key as "gpts" | "chats" });
		if (key === "gpts") populateGpts();
		else populateConversations();
	};

	function initialPopulate() {
		if (!GPTs.length) {
			populateGpts();
			populateConversations();
		}
	}

	// -----------------------RENDER
	return (
		<div className={style["Panel"]}>
			<Tabs activeKey={panelTab} items={items} onChange={onChange} centered />
		</div>
	);
}
