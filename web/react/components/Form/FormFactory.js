import conditionRecursionRender from '@/fe-sdk/utils/conditionsRender';

const FormFactory = ({ form: { getFieldDecorator }, conditions = [] }) =>
  conditionRecursionRender(conditions, [
    {
      conditionDecorators: ({ field, rcFormOptions }) =>
        field ? getFieldDecorator(field, rcFormOptions) : value => value,
      canComposeConditions: ['props', 'rcFormOptions'],
    },
  ]);

export default FormFactory;
