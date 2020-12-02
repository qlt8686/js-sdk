// 尾递归优化 http://www.ruanyifeng.com/blog/2015/04/tail-call.html
const tco = f => {
  let value;
  let active = false;
  let accumulated = [];

  return (...arg) => {
    accumulated.push(arg);
    if (!active) {
      active = true;
      while (accumulated.length) {
        const args = accumulated.shift();
        value = f(...args);
      }
      active = false;
      return value;
    }
  };
};

export default tco;

/**
 *
 * @param {源对象} sourceObj any
 * @param {克隆对象} clone any
 */

export const deepClone = x => {
  if (typeof x !== 'object') return x;

  const root = x instanceof Array ? [] : {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x,
    },
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const { parent, key, data } = node;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = data instanceof Array ? [] : {};
    }
    if (data === null || data === undefined) {
      res = data;
    } else {
      Object.keys(data).forEach(k => {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k],
          });
        } else {
          res[k] = data[k];
        }
      });
    }
  }

  return root;
};

const fib_impl = (n, cont) =>
  n < 1
    ? cont(1)
    : fib_impl.bind(null, n - 1, x =>
        fib_impl.bind(null, n - 2, y => cont.bind(null, x + y)),
      );

export const fib = n => trampoline(fib_impl.bind(null, n, r => r));

export const trampoline = f => {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
};

// fib(4, res => res);
// fib(3, res1 => fib(2, res2 => (res => res)(res1 + res2)));
// fib(2, res1 => fib(1, res2 => (res1 => fib(2, res2 => (res => res)(res1 + res2)))(res1 + res2)));
// fib(1, res1 =>
//   fib(0, res2 =>
//     (res2 => (res1 => fib(2, res2 => (res => res)(res1 + res2)))(res1 + res2))(res1 + res2)
//   )
// );

// (res1 =>
//   fib(0, res2 =>
//     (res2 => (res1 => fib(2, res2 => (res => res)(res1 + res2)))(res1 + res2))(res1 + res2)
//   ))(1);

// (res1 =>
//   (res2 => (res2 => (res1 => fib(2, res2 => (res => res)(res1 + res2)))(res1 + res2))(res1 + res2))(
//     1
//   ))(1);

// (res1 =>
//   (res2 =>
//     (res2 =>
//       (res1 => fib(1, res1 => fib(0, res2 => (res2 => (res => res)(res1 + res2))(res1 + res2))))(
//         res1 + res2
//       ))(res1 + res2))(1))(1);

// (res1 =>
//   (res2 =>
//     (res2 =>
//       (res1 => (res1 => fib(0, res2 => (res2 => (res => res)(res1 + res2))(res1 + res2)))(1))(
//         res1 + res2
//       ))(res1 + res2))(1))(1);

// (res1 =>
//   (res2 =>
//     (res2 =>
//       (res1 => (res1 => (res2 => (res2 => (res => res)(res1 + res2))(res1 + res2))(1))(1))(
//         res1 + res2
//       ))(res1 + res2))(1))(1);

// (res => res)(1 + 1 + 1 + 1 + 1);

// 子模块更新影响测试
