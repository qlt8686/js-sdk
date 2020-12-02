import React, { useState, useEffect } from 'react';

import router from 'umi/router';
import { withRouter } from 'dva/router';

import StandardTable from '../StandardTable';

import compose from '@/fe-sdk/utils/compose';

const limit = 10;

export default compose(withRouter)(CusTable);

function CusTable({
  getRows,
  loading,
  data = [],
  columns = [],
  total,
  getChangeRows = () => {},
  location: { pathname, query },
}) {
  const { page } = query;

  const [rows, setRows] = useState([]);

  useEffect(() => {
    getChangeRows(() => setRows);
  }, []);

  useEffect(() => {
    !!getRows && getRows(rows);
  }, [rows]);

  const handleSelectRows = rows => {
    setRows(rows);
  };

  const handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { current } = pagination;
    if (current !== page) {
      router.push({
        pathname,
        query: {
          ...query,
          page: current,
        },
      });
    }
  };

  const paginationProps = {
    total,
    current: +page || 1,
    pageSize: limit,
  };

  return (
    <StandardTable
      noSelector={!!getRows}
      selectedRows={rows}
      pagination={paginationProps}
      onSelectRow={handleSelectRows}
      onChange={handleStandardTableChange}
      loading={loading}
      data={data}
      columns={columns}
      scroll={{ x: 'max-content' }}
      onRow={record => ({
        onClick: event => {
          if (rows.find(i => i.id === record.id)) {
            setRows(rows.filter(i => i.id !== record.id));
          } else {
            setRows([...rows, record]);
          }
        },
        onDoubleClick: event => {
          setRows([record]);
        },
        onContextMenu: event => {
          setRows([record]);
        },
      })}
    />
  );
}
