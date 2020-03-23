/**
 * 交换数组
 *  */

export default function swapArrayElements(arr, x, y) {
  if (arr[x] === undefined || arr[y] === undefined) {
    return arr;
  }
  const a = x > y ? y : x;
  const b = x > y ? x : y;
  return [
    ...arr.slice(0, a),
    arr[b],
    ...arr.slice(a + 1, b),
    arr[a],
    ...arr.slice(b + 1),
  ];
}
