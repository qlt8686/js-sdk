export default function fill(target, nums, template) {
  const safeTarget = target === null || target === undefined ? [] : target;
  const length = Array.isArray(safeTarget) ? safeTarget.length : 1;
  const diffNums = nums - length;
  return diffNums > 0
    ? [].concat(safeTarget, Array(diffNums).fill(template))
    : target;
}
