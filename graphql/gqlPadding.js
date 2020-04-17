/**
 * 对象转String
 * @param {入参 | Obj} params
 * @return { 出参 | String}
 */
export default function gqlPadding(params) {
  return params
    ? Object.keys(params).reduce(
        (acc, cur) =>
          isValid(params[cur])
            ? `${acc} ${cur}: ${assginType(params[cur])},`
            : acc,
        '',
      )
    : '';
}

function assginType(value) {
  switch (typeof value) {
    case 'number':
    case 'boolean':
      return value;
    case 'string':
      return `"${value}"`;
    case 'object': {
      return Array.isArray(value) ? a2s(value) : o2s(value);
    }
    default:
      console.error(`no valid type, ${typeof value}, ${value}`);
  }
}

function a2s(arr) {
  return `[${arr.reduce(
    (acc, cur) => (isValid(cur) ? `${acc} ${assginType(cur)},` : acc),
    '',
  )} ]`;
}

function o2s(obj) {
  return `{${Object.keys(obj).reduce(
    (acc, cur) =>
      isValid(obj[cur]) ? `${acc} ${cur}: ${assginType(obj[cur])},` : acc,
    '',
  )} }`;
}

function isValid(k) {
  return k !== undefined && k !== null;
}
