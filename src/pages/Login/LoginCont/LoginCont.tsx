// ---Dependencies
import React, { useState } from "react";
import { ApiForm } from "./ApiForm/ApiForm";
// ---Styles
import style from "./LoginCont.module.scss";
import { Start } from "./Start/Start";

/**
 * LoginCont Component:  Descripción del comportamiento...
 */
export function LoginCont() {
	// -----------------------CONSTS, HOOKS, STATES
	const [start, setStart] = useState(false);
	// -----------------------MAIN METHODS
	// -----------------------AUX METHODS
	// -----------------------RENDER
	return (
		<div className={style["LoginCont"]}>
			{start ? (
				<ApiForm goBack={() => setStart(false)} />
			) : (
				<Start onClick={() => setStart(true)} />
			)}
		</div>
	);
}
