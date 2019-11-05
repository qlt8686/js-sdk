import React, { useState } from 'react';
import { Modal } from 'antd';
import { CusInputForm } from '../CusForm';

function CusInputModal({
  width,
  visible,
  title,
  loading,
  footer,
  onSubmit = () => {},
  onCancel = () => {},
  conditions = [],
  okText = '确定',
  cancelText = '取消',
  ...restProps
}) {
  const [innerForm, setInnerForm] = useState();

  const handlerSubmit = () => {
    const { validateFields } = innerForm;
    validateFields((error, value) => {
      if (error) {
        console.error(error);
      } else {
        onSubmit(value);
      }
    });
  };

  return (
    <Modal
      width={width}
      title={title}
      onOk={handlerSubmit}
      onCancel={() => {
        innerForm.resetFields();
        onCancel();
      }}
      footer={footer}
      visible={visible}
      maskClosable={false}
      confirmLoading={loading}
      destroyOnClose
      okText={okText}
      cancelText={cancelText}
      {...restProps}
    >
      <CusInputForm conditions={conditions} onSubmit={handlerSubmit} getInnerForm={setInnerForm} />
    </Modal>
  );
}

export default CusInputModal;
