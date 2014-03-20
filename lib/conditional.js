var reduce = Array.prototype.reduce;

module.exports = function() {
  function block() {
    if(!block.condition) {
      block.condition = arguments[0];
      return block;
    }
    reduce.call(arguments, function(children, el) {
      children.push(el.isBlock ? el : {
        type: 'Literal',
        value: el
      });
      return children;
    }, block.trueBranch);
    return block;
  }
  block.type = 'Conditional';
  block.isBlock = true;
  block.trueBranch = [];
  block.falseBranch = [];
  return block;
};
