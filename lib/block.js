var reduce = Array.prototype.reduce;

module.exports = function(label, stack) {
  function block() {
    if(block.type != 'Node') {
      block.type = 'Node';
      block.children = [];
      block.attributes = [];
    }
    if(stack.length) {
      block.attributes.push.apply(
        block.attributes,
        stack);
      stack.length = 0;
    } else {
      reduce.call(arguments, function(children, el) {
        children.push(el.isBlock ? el : {
          type: 'Literal',
          value: el
        });
        return children;
      }, block.children);
    }
    return block;
  }
  block.type = 'Identifier';
  block.label = label;
  block.isBlock = true;
  return block;
};
