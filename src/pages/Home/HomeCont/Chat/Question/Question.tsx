// ---Dependencies
import React from "react";
import type { Message } from "src/database/Messages/definitions";
import type { WithId } from "src/utils/functions/typesUtils";
import { UpdatePanel } from "../common/UpdatePanel/UpdatePanel";
// ---Styles
import style from "./Question.module.scss";

interface Props {
	message: WithId<Message>;
	reloadChatMsgs: () => void;
}

/**
 * Question Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Question({ message, reloadChatMsgs }: Props) {
	// -----------------------CONSTS, HOOKS, STATES

	// -----------------------MAIN METHODS
	// -----------------------AUX METHODS
	// -----------------------RENDER
	if (!message) return null;
	return (
		<div className={style["Question"]}>
			<section>{message.content}</section>
			<UpdatePanel reloadChatMsgs={reloadChatMsgs} message={message} />
		</div>
	);
}
