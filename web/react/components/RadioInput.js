import React, { forwardRef, useState } from 'react';

import { Radio, Input } from 'antd';

export default forwardRef(
  ({ conditions = [], value = [], onChange, ...props }, ref) => {
    const [curR, curI] = value;
    const [getTempValue, setTempValue] = useState(
      conditions.reduce((acc, cur) => {
        const { rV, iV } = cur;
        acc[rV] = iV;
        return acc;
      }, {}),
    );

    const setTempValueOfIndex = (idx, v) => {
      const temp = {};
      temp[idx] = v;
      setTempValue({ ...getTempValue, ...temp });
    };

    return (
      <Radio.Group
        ref={ref}
        onChange={({ target }) => {
          const { value: tv } = target;
          setTempValueOfIndex(curR, curI);
          onChange([tv, getTempValue[tv]]);
        }}
        value={curR}
        {...props}
      >
        {conditions.map(i => {
          const { rV, lable, unit, placeholder } = i;
          return (
            <Radio
              key={rV}
              value={rV}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <div>
                {lable}
                <Input
                  placeholder={placeholder}
                  style={{ margin: '0 3px', width: 90 }}
                  onFocus={() => {
                    setTempValueOfIndex(curR, curI);
                    if (rV !== curR) onChange([rV, getTempValue[rV]]);
                  }}
                  onChange={e => {
                    const { value: ev } = e.currentTarget;
                    onChange([curR, ev]);
                    setTempValueOfIndex(curR, ev);
                  }}
                  value={curR === rV ? curI : getTempValue[rV]}
                />
                {unit}
              </div>
            </Radio>
          );
        })}
      </Radio.Group>
    );
  },
);
