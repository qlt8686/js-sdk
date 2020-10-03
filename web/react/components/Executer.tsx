import React, { cloneElement } from "react";
import type { Attributes, ReactNode } from "react";
import { unmountComponentAtNode, render } from "react-dom";
import uuid from "../../../native/uuid";

export default class ComponentExecuter {
  static queueMap = new Map();
  static DestroyAll = () => {
    ComponentExecuter.queueMap.forEach((execter) => execter.Destroy());
  };

  Component: React.ReactElement;
  el: HTMLDivElement;
  id: string;

  constructor(Component: React.ReactElement | React.FC | React.ComponentClass) {
    const comp = React.isValidElement(Component)
      ? (
        Component
      )
      : (
        <Component />
      );

    this.Component = cloneElement(comp, {
      execInst: this,
    });
    this.el = document.createElement("div");
    const id = `execter-${uuid(6, 16)}`;
    this.el.setAttribute("id", id);
    this.id = id;
    document.body.appendChild(this.el); // add the text node to the newly created div.

    ComponentExecuter.queueMap.set(id, this);
  }

  Execute() {
    render(this.Component, this.el);
    return this;
  }

  Update<P>(props?: Partial<P> & Attributes, ...children: ReactNode[]) {
    this.Component = cloneElement(this.Component, props, ...children);
    return this;
  }

  Destroy() {
    window.requestIdleCallback(() => {
      unmountComponentAtNode(this.el);
      const pNode = this?.el?.parentNode;
      pNode?.removeChild(this?.el as HTMLDivElement);
    });
    return ComponentExecuter.queueMap.delete(this.id);
  }
}
