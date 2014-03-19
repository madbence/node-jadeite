var block = require('./block');

module.exports = function() {
  var stack = [];
  return Proxy.create({
    set: function(proxy, name, value) {
      stack.push({
        type: 'Attribute',
        name: name,
        value: value.isBlock ? {
          type: 'Identifier',
          name: value.label
        } : {
          type: 'Literal',
          value: value
        }
      });
    },
    get: function(proxy, name) {
      return block(name, stack);
    },
    getPropertyDescriptor: function(name) {
      return {
        writable: true,
        configurable: true
      };
    }
  });
};
