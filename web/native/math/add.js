export default (num1, num2) => {
  const num1Digits = (num1.toString().split('.')[1] || '').length;
  const num2Digits = (num2.toString().split('.')[1] || '').length;
  const baseNum = 10 ** Math.max(num1Digits, num2Digits);
  return (num1 * baseNum + num2 * baseNum) / baseNum;
};
