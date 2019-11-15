module.exports = function(str) {
  return str.replace(/-\w/g, x => x.slice(1).toUpperCase());
};
