export default class Proxy {
  constructor(obj) {
    Object.keys(obj).forEach(o => (this[o] = obj[o]));
  }

  set(k, v) {
    this[k] = v;
    return this;
  }

  setIn(k, v) {
    let temp = this;
    for (let i = 0; i < k.length; i += 1) {
      const ck = k[i];

      if (i + 1 === k.length) {
        temp[ck] = v;
        break;
      }

      if (!temp[ck]) {
        temp[ck] = {};
      }

      temp = temp[ck];
    }

    return this;
  }
}
