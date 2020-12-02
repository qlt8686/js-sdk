// [废弃] 请使用 可选链 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE
/**
 * 遍历object，方便深层查询参数
 * @param object
 * @param array
 * @returns {*}
 */
export default function getIn(
  object: Record<any, any> | Array<any>,
  array: Array<string | number>,
  defaultValue: any,
): any {
  let temp: Record<any, any> | undefined;
  if (
    object &&
    typeof array === 'object' &&
    typeof object === 'object' &&
    array.length > 0
  ) {
    temp = object;
    for (let i = 0; i < array.length; i += 1) {
      if (temp !== null && temp && temp[array[i]] !== undefined) {
        temp = temp[array[i]];
      } else {
        temp = undefined;
        break;
      }
    }
  }
  return temp || defaultValue;
}
