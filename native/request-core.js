import request from 'umi-request';

export default (
  url,
  {
    bussStatusHandler = reps => reps,
    successHandler = reps => reps,
    errorHandler = err => err,
    ...options
  }
) =>
  request(url, { getResponse: true, ...options })
    .then(bussStatusHandler)
    .then(successHandler)
    .catch(errorHandler);
