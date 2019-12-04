import React, { useState, forwardRef } from 'react';
import throttle from '../../../native/throttle';

export default forwardRef(
  (
    {
      onSole = () => {},
      onPeak = () => {},
      onScroll = () => {},
      offset = 0,
      children,
    },
    ref,
  ) => {
    const [flag, setFlag] = useState(false);

    return (
      <div
        ref={ref}
        style={{ overflow: 'scroll' }}
        onScroll={event => {
          if (flag) return;
          const target = event.currentTarget;
          setFlag(true);
          throttle(current => {
            const { height } = current.getBoundingClientRect();
            const { scrollTop, scrollHeight } = current;
            onScroll(target);
            if (scrollTop === 0) {
              onSole(target);
            }
            if (height + scrollTop >= scrollHeight - offset) {
              onPeak(target);
            }
            setFlag(false);
          }, 500)(target);
        }}
      >
              {children}
            
      </div>
    );
  },
);
