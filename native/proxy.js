// 端口转发
export default (url, proxy) => {
  const matchKey = Object.keys(proxy).find(i => url.match(`^${i}`)) || '';
  const { target, pathRewrite = {} } = proxy[matchKey] || {};
  const [source = ' ', targ] = Object.entries(pathRewrite)[0] || [];
  const proxyUrl = url.replace(RegExp(source), targ);
  return target + proxyUrl;
};
