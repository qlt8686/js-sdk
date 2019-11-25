module.exports = function(str, dash = '-') {
  const reg = new RegExp(`${dash}\\w`, 'g');
  return str.replace(reg, x => x.slice(1).toUpperCase());
};
