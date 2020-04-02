/**
 * 对象转String
 * @param {入参 | Obj} params
 * @return { 出参 | String}
 */

export default function assginType(value) {
  switch (typeof value) {
    case 'number':
    case 'boolean':
      return value;
    case 'string':
      return `"${value}"`;
    case 'object':
      return Array.isArray(value) ? a2s(value) : o2s(value);
    default:
      console.error(`no valid type, ${typeof value}, ${value}`);
  }
}

function o2s(params) {
  return params
    ? Object.keys(params).reduce(
        (acc, cur) =>
          params[cur] === undefined
            ? acc
            : `${acc} ${cur}: ${assginType(params[cur])},`,
        '',
      )
    : '';
}

function a2s(arr) {
  return `[${arr.reduce((acc, cur) => `${acc} ${assginType(cur)},`, '')} ]`;
}
