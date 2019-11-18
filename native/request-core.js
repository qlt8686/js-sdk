import axios from 'axios';

export default function(url, options = {}) {
  const {
    extraHandler = reps => reps,
    successHandler = reps => reps,
    errorHandler = err => err,
    ...restOptions
  } = options;

  return axios(url, restOptions)
    .then(extraHandler)
    .then(successHandler)
    .catch(errorHandler);
}
