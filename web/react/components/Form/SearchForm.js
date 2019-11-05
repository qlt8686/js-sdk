import React, { useEffect } from 'react';
import router from 'umi/router';
import { withRouter } from 'dva/router';

import { isEqual } from 'lodash';
import { Form, Button, Input, Row, Col } from 'antd';
import moment from 'moment';
import FormFactory from '.';

import compose from '@/fe-sdk/utils/compose';
import { debounce } from '@/fe-sdk/utils/delayer';

const { create, Item } = Form;

export default compose(
  create(),
  withRouter,
)(CusSearchForm);

function CusSearchForm({
  form,
  conditions = [],
  getInnerForm = () => {},
  location: { pathname, query, search },
  onSubmit = debounce(e => {
    const { validateFields } = form;
    validateFields((error, value) => {
      if (error) {
        console.error(error);
      }

      const temp = { ...value };
      Object.keys(temp).forEach(key => {
        if (!temp[key]) {
          delete temp[key];
        }
        if (temp[key] instanceof moment) {
          temp[key] = temp[key].format('YYYY-MM-DD');
        }
      });

      // if (!isEqual(query, temp) && !Object.values(temp).every(i => !i)) {
      router.push({
        pathname,
        query: temp,
      });
      // }
    });
  }, 300),
  onReset = e => {
    form.resetFields();
    if (search) {
      router.push({
        pathname,
      });
    }
  },
}) {
  const { setFieldsValue } = form;

  useEffect(() => {
    getInnerForm(form);
  }, []);

  useEffect(() => {
    const fields = Object.keys(query).reduce((acc, cur) => {
      const temp = { ...acc };
      if (conditions.some(condition => condition.field === cur)) {
        temp[cur] = query[cur];
      }
      return temp;
    }, {});

    setFieldsValue(fields);
  }, [query]);

  const CusInputFomrConditions = [
    {
      childrenCondition: ({
        component,
        title,
        field,
        labelCol = { span: 8 },
        wrapperCol = { span: title ? 16 : 24 },
        required,
        placeholder,
        rcFormOptions,
        props,
      }) => ({
        component: component || Input,
        wraps: [
          <Col xxl={6} lg={8} md={12} sm={24} xs={24} />,
          <Item label={title} labelCol={labelCol} wrapperCol={wrapperCol} />,
        ],
        rcFormOptions: {
          rules: [
            {
              required,
              message: `需要${title || field}`,
            },
          ],
          ...rcFormOptions,
        },
        props: {
          placeholder: placeholder || `${title || field}`,
          ...props,
        },
      }),
      wraps: [
        <Form onSubmit={onSubmit} labelAlign="left" />,
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" />,
      ],
      component: [
        ...conditions,
        {
          component: [
            <Button type="primary" htmlType="submit">
              查询
            </Button>,
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>,
          ],
        },
      ],
    },
  ];

  return <FormFactory form={form} conditions={CusInputFomrConditions} />;
}
