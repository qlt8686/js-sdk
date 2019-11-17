import { cloneElement } from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import uuid from '../../../../native/uuid';

export default class ComponentExecuter {
  static queueMap = new Map();
  static destroyAll = () => {
    ComponentExecuter.queueMap.forEach(execter => execter.destroy());
  };

  constructor(Component) {
    this.Component = Component;
    this.el = document.createElement('div');
    const id = `execter-${uuid(6, 16)}`;
    this.el.setAttribute('id', id);
    this.id = id;
    document.body.appendChild(this.el); // add the text node to the newly created div.
    ComponentExecuter.queueMap.set(id, this);
  }

  show = () => {
    const elementWithInstance = cloneElement(this.Component, {
      executerInstance: this,
    });
    render(elementWithInstance, this.el);
    return this;
  };

  update = Component => {
    this.Component = Component;
    return this;
  };

  destroy = () => {
    unmountComponentAtNode(this.el);
    this.el.parentNode.removeChild(this.el);
    return ComponentExecuter.queueMap.delete(this.id);
  };
}
