import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Wrap = styled.div``;

export default forwardRef(
  ({ value, onChange, children, ...restProps }, ref) => {
    return (
      <Wrap>
        <input
          type='file'
          ref={ref}
          onChange={(...arg) => {
            console.log(arg);
          }}
          {...restProps}
        />
        {children}
      </Wrap>
    );
  },
);
