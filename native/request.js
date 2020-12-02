const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方式不对',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export default ({ informer = () => {}, requestChain = () => {} }) => (
  url,
  option,
  extra = {},
) => {
  const { silence, errCatch } = extra;
  const dontTip = [].concat(silence);
  return xhrRequest({ url, ...option })
    .then(checkStatus)
    .then(parseResponse)
    .then(response => requestChain(response, extra))
    .catch(e => {
      if (!dontTip.some(i => i === 'fail')) {
        informer(e.message || '请求超时, 请重试');
      }
      if (errCatch) {
        return e;
      }
      throw e;
    });
};

function xhrRequest({
  url,
  method = 'POST',
  contentType = 'application/json',
  limit = 10,
  page = 1,
  params = {},
  formData,
}) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token') || 1;
    let allParams = {};
    let reqUrl = url;
    switch (method.toLowerCase()) {
      case 'post': {
        if (formData) {
          const fd = new FormData();
          Object.keys(params).forEach(cur => fd.append(cur, params[cur]));
          allParams = fd;
        } else {
          allParams = {
            data: params,
            limit,
            page,
            token,
          };
        }
        break;
      }
      case 'get': {
        reqUrl = Object.keys(params).reduce(
          (acc, cur) => `${acc}&${cur}=${params[cur]}`,
          url + '?',
        );
        break;
      }
      default:
        break;
    }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      resolve(xhr);
    };
    xhr.open(method, reqUrl);
    xhr.timeout = 30000; // 超时时间，单位是毫秒
    xhr.ontimeout = e => {
      const error = new Error('请求超时');
      error.body = e;
      // XMLHttpRequest 超时。在此做某事。
      reject(error);
    };
    if (formData) {
      xhr.send(allParams);
    } else {
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(JSON.stringify(allParams));
    }
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

function parseResponse(response) {
  try {
    return JSON.parse(response.responseText);
  } catch (e) {
    throw new Error('数据异常, 请重试', e);
  }
}
