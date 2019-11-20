// deprecated
import { useState } from 'react';
import ComponentExecter from '@/js-sdk/web/react/components/Executer/ComponentExecuter';

function ModalExecuter({


  children,
  container: Modal = <div></div>,
  component: Component,


}) {

  const [form, getForm] = useState({});



  return (

      <Component getForm={getForm} initVal={initVal} />
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
