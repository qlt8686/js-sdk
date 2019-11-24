export default function filter(target, candidate) {
  if (typeof target !== 'object')
    throw new Error('target just arrow array or object');
  const candidateArr = [].concat(candidate);
  const container = Array.isArray(target) ? [] : {};
  return Object.keys(target).reduce((acc, cur) => {
    const curValue = target[cur];
    if (candidateArr.includes(curValue)) return acc;
    acc[cur] = target[cur];
    return acc;
  }, container);
}
