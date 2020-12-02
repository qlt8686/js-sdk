import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import FormFactory from '.';

import compose from '@/fe-sdk/utils/compose';

const { create, Item } = Form;

export default compose(create())(CusInputForm);

export function CusInputForm({
  form,
  conditions = [],
  getInnerForm = () => {},
  onSubmit,
}) {
  const { getFieldValue } = form;

  useEffect(() => {
    getInnerForm(form);
  }, []);

  const CusInputFomrConditions = [
    {
      childrenCondition: ({
        component,
        title,
        field,
        labelCol = { span: 4 },
        wrapperCol = { span: title ? 20 : 24 },
        required,
        placeholder,
        type,
        initVal,
        options,
        confirm,
        disabled,
        colStyle = { span: 24 },
        labelAlign,
        extra,
        compProps = {},
        itemProps = {},
        colProps = {},
        rcFormOptions = {},
      }) => ({
        component: component || Input,
        wraps: [
          <Col {...colStyle} {...colProps} />,
          <Item
            label={title}
            labelCol={labelCol}
            labelAlign={labelAlign}
            wrapperCol={wrapperCol}
            extra={extra}
            {...itemProps}
          />,
        ],
        rcFormOptions: {
          initialValue: initVal,
          rules: [
            {
              required,
              message: `请完善您的${title || field}`,
            },
            {
              validator: confirm
                ? (rule, value, callback) => {
                    if (value && value !== getFieldValue(confirm)) {
                      callback('两次密码不一致');
                    } else {
                      callback();
                    }
                  }
                : (rule, value, callback) => {
                    callback();
                  },
            },
          ],
          ...rcFormOptions,
        },
        props: {
          placeholder: placeholder || `请填写${title || field}`,
          type,
          options,
          disabled,
          ...compProps,
        },
      }),
      wraps: [
        <Form onSubmit={onSubmit} />,
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" />,
      ],
      component: [
        ...conditions,
        <Button htmlType="submit" style={{ display: 'none' }} />,
      ],
    },
  ];

  return <FormFactory form={form} conditions={CusInputFomrConditions} />;
}
