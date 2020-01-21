// /**
//  * 对象转String
//  * @param {入参 | Obj} params
//  * @return { 出参 | String}
//  */
export default function paramsPadding(params) {
  return Object.keys(params).reduce(
    (acc, cur) => `${acc} ${cur}: ${assginType(params[cur])},`,
    '',
  );
}

function assginType(value) {
  switch (typeof value) {
    case 'number':
    case 'boolean':
      return value;
    case 'string':
      return `"${value}"`;
    case 'object':
      return Array.isArray(value) ? a2s(value) : o2s(value);
    default:
      throw new Error('no valid type', typeof value, value);
  }
}

function a2s(arr) {
  return `[${arr.reduce((acc, cur) => `${acc} ${assginType(cur)},`, '')} ]`;
}

function o2s(obj) {
  return `{${Object.keys(obj).reduce(
    (acc, cur) => `${acc} ${cur}: ${assginType(obj[cur])},`,
    '',
  )} }`;
}
