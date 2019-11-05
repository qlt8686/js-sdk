import React, { forwardRef } from 'react';

import moment from 'moment';

import { DatePicker } from 'antd';

export default forwardRef(({ value, onChange, ...props }, ref) => {
  const formatValue = value && moment(value);
  return (
    <DatePicker
      onChange={(moment, format) => {
        onChange(format);
      }}
      ref={ref}
      value={formatValue}
      {...props}
    />
  );
});
