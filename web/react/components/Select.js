import React, { forwardRef } from 'react';

import { Select } from 'antd';
import getIn from '@/js-sdk/native/getIn';

export default forwardRef((props, ref) => (
  <Select
    ref={ref}
    showSearch
    filterOption={(input, option) => {
      const { children = '', value = '' } = getIn(option, ['props'], {});
      const isMatch = text =>
        text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      return isMatch(children) || isMatch(value);
    }}
    {...props}
  />
));
