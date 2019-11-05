import React, { forwardRef } from 'react';

import moment from 'moment';

import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export default forwardRef(({ value = [], onChange, ...props }, ref) => {
  const formatValue = value && value.map(i => moment(i));
  return (
    <RangePicker
      onChange={(moment, format) => {
        onChange(format);
      }}
      ref={ref}
      value={formatValue}
      {...props}
    />
  );
});
