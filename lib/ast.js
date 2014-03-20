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
  },
  Conditional: function(block) {
    return {
      type: 'Conditional',
      condition: block.condition.label,
      trueBranch: block.trueBranch.map(function(child) {
        return handlers[child.type](child);
      }),
      falseBranch: block.falseBranch.map(function(child) {
        return handlers[child.type](child);
      }),
    };
  }
};

function AST(block) {
  return handlers[block.type](block);
}

module.exports = AST;
