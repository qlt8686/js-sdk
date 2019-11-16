import request from 'umi-request';

export default function(url, options = {}) {
  const {
    extraHandler = reps => reps,
    successHandler = reps => reps,
    errorHandler = err => err,
    ...restOptions
  } = options;

  return request(url, { getResponse: true, ...restOptions })
    .then(extraHandler)
    .then(successHandler)
    .catch(errorHandler);
}
