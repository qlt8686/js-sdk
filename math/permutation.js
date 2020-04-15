export default function permutation(arr) {
  const lengthArr = [];
  const productArr = [];
  const result = [];
  let length = 1;
  for (let i = 0; i < arr.length; i++) {
    const len = arr[i].length;
    lengthArr.push(len);
    const product = i === 0 ? 1 : arr[i - 1].length * productArr[i - 1];
    productArr.push(product);
    length *= len;
  }
  for (let i = 0; i < length; i++) {
    const resultItem = [];
    for (let j = 0; j < arr.length; j++) {
      resultItem.push(arr[j][Math.floor(i / productArr[j]) % lengthArr[j]]);
    }
    result.push(resultItem);
  }
  return result;
}
