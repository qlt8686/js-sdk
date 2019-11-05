import React from 'react';
import { Modal, Row, Col } from 'antd';
import styled from 'styled-components';

const Wrap = styled.div`
  font-size: 16px;
  line-height: 32px;
`;

function CusInputModal({
  visible,
  title,
  loading,
  footer,
  onSubmit = () => {},
  onCancel = () => {},
  conditions = [],
}) {
  return (
    <Modal
      title={title}
      onOk={onSubmit}
      onCancel={onCancel}
      footer={footer}
      width="61.8%"
      visible={visible}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose
    >
      <Wrap>
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          {conditions.map(i => {
            const { field, title: label, cusGrid, renderValue = '' } = i;
            return (
              <Col key={field} {...cusGrid}>
                {label}
                {renderValue}
              </Col>
            );
          })}
        </Row>
      </Wrap>
    </Modal>
  );
}

export default CusInputModal;
