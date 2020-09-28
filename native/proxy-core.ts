/**
 * 参考webpack devServer 的 proxy
 * https://webpack.docschina.org/configuration/dev-server/#devserver-proxy
 * @param {url} url 请求的url
 * @param {options} Options proxy的参数
 */

export interface ProxySchma {
  [matchPath: string]: {
    target: string | Function;
    pathRewrite?: {
      [searchvalue: string]: string;
    };
  };
}

export default (url: string, proxy: ProxySchma) => {
  const matchKey = Object.keys(proxy).find(i => url.match(`^${i}`)) || '';
  const { target, pathRewrite = {} } = proxy[matchKey] || {};
  const [source = ' ', targ] = Object.entries(pathRewrite)[0] || [];
  const proxyUrl = url.replace(RegExp(source), targ);
  return typeof target === 'function' ? target() + proxyUrl : target + proxyUrl;
};
