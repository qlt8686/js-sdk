module.exports = function(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
};
