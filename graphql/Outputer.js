class Outputer {
  constructor(...args) {
    this.output = args;
  }

  toString = () => {
    return `{${this.output.reduce(
      (acc, cur) =>
        `${acc} ${
          typeof cur === 'string'
            ? cur
            : Object.keys(cur).reduce((_, c) => `${c} ${cur[c]}`, '')
        },`,
      '',
    )}}`;
  };

  just = (...args) => {
    return new Outputer(...args);
  };

  filter = (...args) => {
    return new Outputer(
      ...this.output.filter(cur =>
        typeof cur === 'string'
          ? !args.includes(cur)
          : args.includes(Object.keys(cur)[0]),
      ),
    );
  };
}

function outputerFactory(...args) {
  return new Outputer(...args);
}

export default outputerFactory;
