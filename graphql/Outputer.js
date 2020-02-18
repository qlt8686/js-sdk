class Outputer {
  constructor(...args) {
    if (typeof args[0] === 'object') {
      this.output = args[0];
    } else {
      this.output = args.reduce((acc, cur) => ({ ...acc, [cur]: cur }), {});
    }
  }

  toString = () => {
    return `{${Object.keys(this.output).reduce(
      (acc, cur) =>
        `${acc} ${
          typeof this.output[cur] === 'string'
            ? cur
            : `${cur} ${this.output[cur]}`
        },`,
      '',
    )}}`;
  };

  get = key => {
    return this.output[key];
  };

  set = (key, value) => {
    return new Outputer({ ...this.output, [key]: value });
  };

  just = obj => {
    return new Outputer(obj);
  };

  filter = (...args) => {
    return new Outputer(
      Object.keys(this.output).reduce(
        (acc, cur) =>
          args.includes(cur) ? acc : { ...acc, [cur]: this.output[cur] },
        {},
      ),
    );
  };
}

function outputerFactory(Obj) {
  return new Outputer(Obj);
}

export default outputerFactory;
