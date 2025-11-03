// ---Dependencies

import { Icon } from "@iconify/react";
import React from "react";
// ---Styles
import style from "./Spinner.module.scss";

interface Props {
	isLoading?: boolean;
	displayMessage?: string;
}

/**
 * Spinner Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Spinner({ isLoading = true, displayMessage }: Props) {
	// -----------------------CONSTS, HOOKS, STATES
	// -----------------------MAIN METHODS
	// -----------------------AUX METHODS
	// -----------------------RENDER
	if (!isLoading) return null;
	return (
		<div className={style["Spinner"]}>
			<Icon icon="ant-design:loading-outlined" />
			<div className="Message">{displayMessage}</div>
		</div>
	);
}
