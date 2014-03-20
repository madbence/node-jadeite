var AST = require('./ast');

function handle(obj, collect, context) {
  return handlers[obj.type](obj, collect, context);
}

var handlers = {
  Node: function(node, collect, context) {
    collect('<' + node.name);
    node.attributes.forEach(function(attribute) {
      handle(attribute, collect, context);
    });
    if(!node.children.length) {
      collect(' />');
      return;
    }
    collect('>');
    node.children.forEach(function(child) {
      handle(child, collect, context);
    });
    collect('</' + node.name + '>');
  },
  Attribute: function(attribute, collect, context) {
    collect(' ' + attribute.name + '="');
    handle(attribute.value, collect, context);
    collect('"');
  },
  Literal: function(literal, collect) {
    collect(literal.value);
  },
  Identifier: function(identifier, collect, context) {
    collect({
      type: 'Identifier',
      value: context + '.' + identifier.name
    });
  },
  Conditional: function(conditional, collect, context) {
    console.log(conditional);
    collect({
      type: 'JSLiteral',
      value: 'if(' + context + '.' + conditional.condition + ') {'
    });
    conditional.trueBranch.forEach(function(child) {
      handle(child, collect, context);
    });
    if(!conditional.falseBranch.length) {
      return collect({
        type: 'JSLiteral',
        value: '}'
      });
    }
    collect({
      type: 'JSLiteral',
      value: '} else {'
    });
    conditional.falseBranch.forEach(function(child) {
      handle(child, collect, context);
    });
    collect({
      type: 'JSLiteral',
      value: '}'
    });
  }
}

module.exports = function(block) {
  var ast = AST(block);
  var stack = [];
  function collect(value) {
    if(typeof value == 'string') {
      value = {
        type: 'Literal',
        value: value
      }
    }
    var n = stack.length - 1;
    if(n >= 0 && value.type == 'Literal' && stack[n].type == 'Literal') {
      stack[n].value += value.value;
    } else {
      stack.push(value);
    }
  }
  handle(ast, collect, 'data');
  return new Function('data', 'var a = [];\n' + stack.map(function(item) {
    if(item.type == 'Literal') {
      return 'a.push(\'' + item.value + '\');';
    }
    if(item.type == 'JSLiteral') {
      return item.value;
    }
    return 'a.push(' + item.value + ');';
  }).join('\n') + '\nreturn a.join(\'\');');
};
