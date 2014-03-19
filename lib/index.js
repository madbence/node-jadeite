var compile = require('./compile');
var proxy = require('./proxy');

module.exports = function(template) {
  return compile(template(proxy()));
};
