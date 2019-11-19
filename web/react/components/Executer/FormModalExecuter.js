import { useState } from 'react';
import ComponentExecter from '@/js-sdk/web/react/components/Executer/ComponentExecuter';

function ModalExecuter({
  executerInstance,
  onOk = () => {},
  onCancel = () => {},
  children,
  container: Modal = <div></div>,
  component: Component,
  ...restProps
}) {
  const [getVisible, setVisible] = useState(true);
  const [getLoading, setLoading] = useState(false);
  const [form, getForm] = useState({});
  const { validateFields } = form;
  function injectLoading(fn, ...arg) {
    setLoading(true);
    return new Promise(resolve => {
      resolve(fn(...arg));
    })
      .then(() => {
        setVisible(false);
        setTimeout(executerInstance.destroy, 1000);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Modal
      visible={getVisible}
      isLoading={getLoading}
      onCancel={(...arg) => injectLoading(onCancel, ...arg)}
      onOk={(...arg) =>
        validateFields((error, value) => injectLoading(onOk, value, ...arg))
      }
      {...restProps}
    >
      <Component getForm={getForm} />
    </Modal>
  );
}

function factory(options) {
  return new ComponentExecter((<ModalExecuter {...options} />));
}

factory.preload = preloads => {
  return options => factory({ ...preloads, ...options });
};

export default factory;
