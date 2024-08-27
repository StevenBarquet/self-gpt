// ---Dependencies
import React from 'react';
// ---Styles
import style from './MessagesPagination.module.scss';
import { useAppLogicStore } from 'src/store/appLogic';
import { Pagination } from 'antd';

/**
 * MessagesPagination Component:  Descripción del comportamiento...
 */
export function MessagesPagination() {
  // -----------------------CONSTS, HOOKS, STATES
  const { allMessages, currentPage, pageSize, update } = useAppLogicStore();
  const msgsLength = allMessages?.filter((e) => !e.originalcontext).length;
  // -----------------------MAIN METHODS
  const handlePageChange = (page: number) => {
    update({ currentPage: page });
  };
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!allMessages?.length) return null;
  return (
    <div className={style['MessagesPagination']}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={msgsLength}
        onChange={handlePageChange}
      />
    </div>
  );
}
