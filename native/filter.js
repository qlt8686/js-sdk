export default function filter(target, candidate, referenceNotNull) {
  if (typeof target !== 'object')
    throw new Error('target just arrow array or object');
  const trueCandidate =
    typeof candidate === 'function' ? candidate : [].concat(candidate);
  const container = Array.isArray(target) ? [] : {};
  return Object.keys(target).reduce((acc, cur) => {
    const curValue = target[cur];
    if (
      typeof candidate === 'function'
        ? !trueCandidate(curValue)
        : trueCandidate.includes(curValue)
    )
      return acc;
    if (
      referenceNotNull &&
      typeof curValue === 'object' &&
      !Object.values(curValue).filter(Boolean).length
    )
      return acc;

    if (Array.isArray(target)) {
      return [...acc, curValue];
    } else {
      return { ...acc, [cur]: curValue };
    }

  }, container);
}
