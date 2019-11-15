/**
 * 组合函数
 * @param  {fns} Functions
 * @return {HOF} Function
 */
const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
    value => value
  );

export default compose;
