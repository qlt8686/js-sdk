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
      if (i + 1 === k.length) {
        temp[k[i]] = v;
      } else {
        temp[k[i]] = {};
      }

      temp = temp[k[i]];
    }

    return this;
  }
}
