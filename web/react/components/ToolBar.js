import React, { isValidElement, cloneElement } from 'react';

import { Button, Popconfirm } from 'antd';

import styled from 'styled-components';
import compose from '@/fe-sdk/utils/compose';

export default compose()(CusToolBar);

const Wrap = styled.div`
  & > * {
    :not(:last-child) {
      margin-right: ${({ direction }) => (direction === 'row' ? 6 : 0)}px;
      margin-left: ${({ direction }) => (direction === 'row-reverse' ? 6 : 0)}px;
      margin-top: ${({ direction }) => (direction === 'column-reverse' ? 8 : 0)}px;
      margin-bottom: ${({ direction, wrap }) =>
        (direction === 'column' || wrap === 'true' ? 8 : 0)}px;
    }
  }
  display: flex;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'unset')};
  flex-direction: ${({ direction }) => direction};
`;

function CusToolBar({ options = [], direction = 'row', wrap = false }) {
  return (
    <Wrap direction={direction} wrap={wrap.toString()}>
      {options
        .filter(i => !!i)
        .map((option, index) => {
          if (isValidElement(option)) return cloneElement(option, { key: index });
          const {
            confirm,
            disabled,
            onClick,
            title,
            type = 'primary',
            confirmMsg,
            loading,
            size,
            icon,
          } = option;
          if (confirm) {
            return (
              <Popconfirm
                key={index}
                placement="topRight"
                title={confirmMsg || `是否确认${title}？`}
                disabled={disabled}
                onConfirm={onClick}
                okText="确认"
                cancelText="取消"
              >
                <Button icon={icon} size={size} loading={loading} type={type} disabled={disabled}>
                  {title}
                </Button>
              </Popconfirm>
            );
          }
          return (
            <Button
              icon={icon}
              size={size}
              loading={loading}
              key={index}
              type={type}
              onClick={onClick}
              disabled={disabled}
            >
              {title}
            </Button>
          );
        })}
    </Wrap>
  );
}
