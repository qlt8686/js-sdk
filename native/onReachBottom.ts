export default function OnReachBottom(callback: Function, overflow = 0) {
  return (e: any, ...args: any[]) => {
    const ele = e?.currentTarget;
    if (ele instanceof HTMLElement) {
      const { height } = ele.getBoundingClientRect();
      // 当前滚动量 + 元素高度 + 偏移量 >= 元素可滚动高度 说明触底
      if (ele.scrollTop + height + overflow >= ele.scrollHeight) {
        callback(e, ...args);
      }
    }
  };
}
