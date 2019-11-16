import request from 'umi-request';

export default (
  url,
  {
    extraHandler = reps => reps,
    successHandler = reps => reps,
    errorHandler = err => err,
    ...options
  }
) =>
  request(url, { getResponse: true, ...options })
    .then(extraHandler)
    .then(successHandler)
    .catch(errorHandler);
