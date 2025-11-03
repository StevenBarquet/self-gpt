// ---Dependencies

import { Icon } from "@iconify/react";
import { Button, message } from "antd";
import React from "react";
// ---Styles
import style from "./CopyButton.module.scss";

interface Props {
	alertMsg?: string;
	toCopy: string;
}

/**
 * CopyButton Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function CopyButton({ toCopy, alertMsg }: Props) {
	// -----------------------CONSTS, HOOKS, STATES
	const [messageApi, contextHolder] = message.useMessage();
	// -----------------------MAIN METHODS
	function copyText() {
		copyToClipboard(toCopy);
		onSuccessAlert(alertMsg);
	}
	// -----------------------AUX METHODS
	function onSuccessAlert(message?: string) {
		messageApi.open({
			type: "success",
			content: message || "Text copied",
		});
	}
	// -----------------------RENDER
	return (
		<>
			{contextHolder}
			<div className={style["CopyButton"]}>
				<Button onClick={copyText} type="text">
					<Icon icon="mingcute:copy-line" />
				</Button>
			</div>
		</>
	);
}

export async function copyToClipboard(toCopy: string) {
	await navigator.clipboard.writeText(toCopy);
}
