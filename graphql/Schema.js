class Schema {
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
    return new Schema({ ...this.output, [key]: value });
  };

  just = obj => {
    return new Schema(obj);
  };

  filter = (...args) => {
    return new Schema(
      Object.keys(this.output).reduce(
        (acc, cur) =>
          args.includes(cur) ? acc : { ...acc, [cur]: this.output[cur] },
        {},
      ),
    );
  };
}

function schemaFactory(...Obj) {
  return new Schema(...Obj);
}

export default schemaFactory;
