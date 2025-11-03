// ---Dependencies

import { createClient } from "@supabase/supabase-js";
import { Button } from "antd";
import OpenAI from "openai";
import React, { useState } from "react";
import { useKeysStore } from "src/store/keys";
import { swalApiError } from "src/utils/functions/alertUtils";
// ---Styles
import style from "./ApiForm.module.scss";
import { DBValidate } from "./DBValidate/DBValidate";
import { Setup } from "./Setup/Setup";
import { SingleValidate } from "./SingleValidate/SingleValidate";

interface Props {
	goBack: () => void;
}

/**
 * ApiForm Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ApiForm({ goBack }: Props) {
	// -----------------------CONSTS, HOOKS, STATES
	const { update } = useKeysStore();
	const [validDB, setValidDB] = useState({ valid: false, url: "", key: "" });
	const [validGpt, setValidGpt] = useState({ valid: false, key: "" });
	// const [validClaude, setValidClaude] = useState<boolean>(false);
	// -----------------------MAIN METHODS
	async function onValidateDB(url: string, key: string) {
		try {
			const supabase = createClient(url, key);

			console.log("connection done", supabase);
			setValidDB({ valid: true, url, key });
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con OpenAi");
		}
	}

	async function onValidateGpt(apiKey: string) {
		const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

		try {
			await openai.chat.completions.create({
				messages: [{ role: "system", content: "You are a helpful assistant." }],
				model: "gpt-3.5-turbo",
			});

			setValidGpt({ valid: true, key: apiKey });
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con OpenAi");
		}
	}

	// async function onValidateClaude(apiKey: string) {
	//   const anthropic = new Anthropic({ apiKey: apiKey,  });

	//   try {
	//     const stream = await anthropic.messages.create({
	//       model: 'claude-3-5-sonnet-20240620',
	//       max_tokens: 1024,
	//       messages: [{ role: 'user', content: 'Hello, Claude' }],
	//     });

	//     console.log(stream);

	//     setValidClaude(true);
	//   } catch (error: any) {
	//     console.log(error);
	//     await swalApiError(error?.message || 'Error al conectarse con Anthropic');
	//   }
	// }

	function saveKeys() {
		update({
			SUPABASE_KEY: validDB.key,
			SUPABASE_URL: validDB.url,
			OPEN_AI_API_KEY: validGpt.key,
		});
	}
	// -----------------------AUX METHODS
	// -----------------------RENDER
	return (
		<div className={style["ApiForm"]}>
			<Setup goBack={goBack}>
				<h1>Enter Credentials</h1>
				<DBValidate isValid={validDB.valid} onValidate={onValidateDB} />
				<SingleValidate
					label="OPEN_AI_API_KEY"
					isValid={validGpt.valid}
					onValidate={onValidateGpt}
				/>
				<Button
					className="continue"
					disabled={!validDB.valid || !validGpt.valid}
					block
					onClick={saveKeys}
					type="primary"
				>
					Continue
				</Button>
			</Setup>
		</div>
	);
}
