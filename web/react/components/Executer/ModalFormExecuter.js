import React, { cloneElement } from 'react';
import ReactDOM from 'react-dom';
import { CusInputModal } from '../CusModal';

const queue = [];
class ModalExecuter {
  constructor(props = {}) {
    this.props = this.injectPropFunction(props);

    const uid = `cusModal-${Date.now()}`;
    this.el = document.createElement('div');
    this.el.setAttribute('id', uid);
    document.body.appendChild(this.el); // add the text node to the newly created div.
    this.Modal = <CusInputModal />;
    queue.push(this);
  }

  setAttribute(attr) {
    return this.update({ ...this.props, ...attr });
  }

  show() {
    return this.setAttribute({ visible: true });
  }

  hiden() {
    return this.setAttribute({ visible: false });
  }

  setLoading(visible) {
    return this.setAttribute({ loading: visible });
  }

  update(props) {
    const injectedProps = Object.keys(props).reduce(
      (acc, cur) =>
        (typeof props[cur] === 'function' && props[cur] !== this.props[cur]
          ? { ...acc, ...this.injectPropFunction({ [cur]: props[cur] }) }
          : { ...acc, [cur]: props[cur] }),
      {},
    );
    this.props = injectedProps;
    this.Modal = cloneElement(this.Modal, this.props);
    ReactDOM.render(this.Modal, this.el);
    return this;
  }

  destroy() {
    this.hiden();
    ReactDOM.unmountComponentAtNode(this.el);
    this.el.parentNode.removeChild(this.el);
    return this;
  }

  injectPropFunction(props) {
    return Object.keys(props).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]:
          typeof props[cur] === 'function'
            ? value => props[cur]({ value, instance: this })
            : props[cur],
      }),
      {},
    );
  }
}

const ModalExecuterMgt = props => new ModalExecuter(props);

ModalExecuterMgt.destroyAll = () => {
  queue.forEach(cusModal => setTimeout(() => cusModal.destroy()));
};

ModalExecuterMgt.hidenAll = () => {
  queue.forEach(cusModal => cusModal.hiden());
};

export default ModalExecuterMgt;
