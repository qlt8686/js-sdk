import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'dva';

import { Form, Button } from 'antd';

import debounce from '@/js-sdk/native/debounce';
import conditionRender from 'condition-render';
import moment from 'moment';
moment.locale('zh-cn');

export default function CusSearchForm({ conditions = [] }) {
  const history = useHistory();
  const { pathname, query, search } = useLocation();
  const [form] = Form.useForm();

  const condition = {
    '@wrap': [
      <Form
        initialValues={Object.keys(query).reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: moment(query[cur]).isValid()
              ? moment(query[cur])
              : query[cur],
          }),
          {},
        )}
        form={form}
        layout="inline"
        onFinish={debounce(e => {
          const q = Object.keys(e).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: moment.isMoment(e[cur]) ? e[cur].toISOString() : e[cur],
            }),
            {},
          );
          history.push({
            pathname,
            query: q,
          });
        }, 300)}
      />,
    ],
    '@decorator': [
      (Target, params) => {
        const { title, field, rules = [], required } = params;
        const ext = field
          ? {
              name: field,
            }
          : {};

        // 如果有required 简写 rulue
        if (required) {
          ext.rules = [
            { required: true, message: `${title || field}不能为空` },
          ];
        }

        // 如果有rule则使用自定义rule
        if (rules.length) {
          ext.rules = rules;
        }

        return (
          <Form.Item label={title} {...ext} style={{ marginBottom: 8 }}>
            {Target}
          </Form.Item>
        );
      },
    ],
    '@component': [
      ...conditions,
      <Button type="primary" htmlType="submit">
        查找
      </Button>,
      <Button
        onClick={debounce(() => {
          if (search) {
            history.push({
              pathname,
            });
          }
          setTimeout(form.resetFields);
        }, 300)}
      >
        清空
      </Button>,
    ],
  };

  return conditionRender(condition);
}
