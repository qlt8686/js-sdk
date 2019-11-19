import { useState } from 'react';
import ComponentExecter from '@/js-sdk/web/react/components/Executer/ComponentExecuter';

function ModalExecuter({
  executerInstance,
  onOk = () => {},
  onCancel = () => {},
  children,
  container: Modal = <div></div>,
  ...restProps
}) {
  const [getVisible, setVisible] = useState(true);
  const [getLoading, setLoading] = useState(false);

  function injectLoading(fn, ...arg) {
    console.log(fn);
    setLoading(true);
    console.log(fn, ...arg);
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
      onOk={(...arg) => injectLoading(onOk, ...arg)}
      {...restProps}
    >
      {children}
    </Modal>
  );
}

function factory(options) {
  return new ComponentExecter((<ModalExecuter {...options} />));
}

factory.use = container => {
  return options => factory({ container, ...options });
};

export default factory;
