var handlers = {
  Node: function(node) {
    return {
      type: 'Node',
      name: node.label,
      children: node.children.map(function(child) {
        return handlers[child.type](child);
      }),
      attributes: node.attributes
    };
  },
  Identifier: function(identifier) {
    return {
      type: 'Identifier',
      name: identifier.label,
    };
  },
  Literal: function(literal) {
    return literal;
  }
};

function AST(block) {
  return handlers[block.type](block);
}

module.exports = AST;
