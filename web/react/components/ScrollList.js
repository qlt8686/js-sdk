import React, { useState, forwardRef } from 'react';
import throttle from '../../../native/throttle';
import styled from 'styled-components';

const Wrap = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  overflow: scroll;
  height: 100%;
`;

export default forwardRef(
  (
    {
      onSole = () => {},
      onPeak = () => {},
      onScroll = () => {},
      offset = 0,
      delay = 500,
      children,
    },
    ref,
  ) => {
    const [flag, setFlag] = useState(false);

    return (
      <Wrap
        ref={ref}
        onScroll={event => {
          if (flag) return;
          event.persist();
          setFlag(true);
          throttle(e => {
            const current = e.currentTarget;
            const { height } = current.getBoundingClientRect();
            const { scrollTop, scrollHeight } = current;
            onScroll(current);
            if (scrollTop === 0) {
              onSole(current);
            }
            if (height + scrollTop >= scrollHeight - offset) {
              onPeak(current);
            }
            setFlag(false);
          }, delay)(event);
        }}
      >
              {children}
            
      </Wrap>
    );
  },
);
