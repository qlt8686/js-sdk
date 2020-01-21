/**
 * 对象转String
 * @param {入参 | Obj} params
 * @return { 出参 | String}
 */
export default function paramsPadding(params) {
  return Object.keys(params).reduce(
    (acc, cur) => `${acc} ${cur}: ${assginType(params[cur])}`,
    '',
  );
}

function assginType(value) {
  switch (typeof value) {
    case 'number':
      return value;
    case 'string':
      return `"${value}"`;
    default:
      throw new Error('no valid type', typeof value, value);
  }
}
