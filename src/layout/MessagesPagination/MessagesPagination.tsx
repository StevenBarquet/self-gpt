// ---Dependencies

import { Pagination } from "antd";
import React from "react";
import { useAppLogicStore } from "src/store/appLogic";
// ---Styles
import style from "./MessagesPagination.module.scss";

/**
 * MessagesPagination Component:  Descripción del comportamiento...
 */
export function MessagesPagination() {
	// -----------------------CONSTS, HOOKS, STATES
	const { allMessages, currentPage, pageSize, update } = useAppLogicStore();
	const msgsLength = allMessages?.filter((e) => !e.original_context).length;
	// -----------------------MAIN METHODS
	const handlePageChange = (page: number) => {
		update({ currentPage: page });
	};
	// -----------------------AUX METHODS
	// -----------------------RENDER
	if (!allMessages?.length) return null;
	return (
		<div className={style["MessagesPagination"]}>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={msgsLength}
				onChange={handlePageChange}
			/>
		</div>
	);
}
