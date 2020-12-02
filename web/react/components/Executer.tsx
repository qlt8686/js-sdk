// Undo weakMap 重构队列
import React, { cloneElement } from "react";
import type { Attributes, ReactNode } from "react";
import { unmountComponentAtNode, render } from "react-dom";
import uuid from "../../../native/uuid";

export default class ComponentExecuter {
  static queueMap = new Map();
  static DestroyAll() {
    ComponentExecuter.queueMap.forEach((execter) => execter.Destroy());
  }

  protected comp: React.ReactElement;
  protected el: HTMLDivElement;
  protected id: string;

  constructor(Component: React.ReactElement | React.FC | React.ComponentClass) {
    this.comp = React.isValidElement(Component)
      ? (
        Component
      )
      : (
        <Component />
      );

    this.el = document.createElement("div");
    const id = `execter-${uuid(6, 16)}`;
    this.el.setAttribute("id", id);
    this.id = id;
    document.body.appendChild(this.el); // add the text node to the newly created div.

    ComponentExecuter.queueMap.set(id, this);
  }

  Execute() {
    render(this.comp, this.el);
    return this;
  }

  Update<P>(props?: Partial<P> & Attributes, ...children: ReactNode[]) {
    this.comp = cloneElement(this.comp, props, ...children);
    return this;
  }

  Destroy() {
    if (window.requestIdleCallback){
      window.requestIdleCallback(() => {
        unmountComponentAtNode(this.el);
        this?.el.remove();
        ComponentExecuter.queueMap.delete(this.id);
      });
    }else{
      window.setTimeout(() => {
        unmountComponentAtNode(this.el);
        this?.el.remove();
        ComponentExecuter.queueMap.delete(this.id);
      });
    }
  }
}
