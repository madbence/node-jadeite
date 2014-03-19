module.exports = function(f) {
  var p = Proxy.create({
    get: function(r, n) {
      return Elem(n);
    },
    set: function(r, n, v) {
      attributeStack.push({
        name: n,
        value: typeof v == 'function' ? {
          type: 'variable',
          name: v.tagName
        } : {
          type: 'literal',
          value: v
        }
      });
    },
    getPropertyDescriptor: function(n) {
      return {
        writable: true,
        configurable: true,
      };
    },
  });
  return compile(f(p).toAST());
};

var attributeStack = [];

var Elem = function(name) {
  var f = function(el) {
    f.type = 'node';
    if(el == undefined) {
      return f;
    }
    if(attributeStack.length) {
      f.attributes = attributeStack;
      attributeStack = [];
      return f;
    }
    f.children.push(typeof el == 'function' ? el : {
      type: 'literal',
      value: el
    });
    return f;
  };
  f.type = 'idunno';
  f.tagName = name;
  f.children = [];
  f.attributes = [];
  f.toAST = function() {
    if(f.type != 'node') {
      return {
        type: 'variable',
        name: name
      };
    }
    return {
      name: name,
      type: 'node',
      children: f.children.map(function(child) {
        return typeof child === 'function' ? child.toAST() : child;
      }),
      attributes: f.attributes,
    };
  }
  return f;
}
function compile(ast) {
  var stack = [];
  var attrWalkers = {
    literal: function(attribute) {
      stack.push({
        type: 'literal',
        value: attribute.value.value
      });
    },
    variable: function(attribute) {
      stack.push({
        type: 'variable',
        name: attribute.value.name
      });
    }
  }
  var walkers = {
    node: function(node) {
      stack.push({
        type: 'literal',
        value: '<' + node.name
      });
      node.attributes.forEach(function(attribute) {
        stack.push({
          type: 'literal',
          value: ' ' + attribute.name + '="'
        });
        attrWalkers[attribute.value.type](attribute);
        stack.push({
          type: 'literal',
          value: '"',
        });
      });
      if(!node.children.length) {
        stack.push({
          type: 'literal',
          value: ' />'
        });
        return;
      }
      stack.push({
        type: 'literal',
        value: '>'
      });
      node.children.forEach(function(child) {
        return walkers[child.type](child);
      });
      stack.push({
        type: 'literal',
        value: '</' + node.name + '>'
      });
    },
    variable: function(node) {
      stack.push(node)
    },
    literal: function(node) {
      stack.push({
        type: 'literal',
        value: node.value
      });
    }
  };
  walkers[ast.type](ast);
  var reduced = stack.reduce(function(reduced, item) {
    if(item.type == 'literal') {
      if(reduced[reduced.length-1] && reduced[reduced.length-1][0] == '\'') {
        reduced[reduced.length-1] = reduced[reduced.length-1].slice(0, reduced[reduced.length-1].length-1) + item.value + '\'';
      } else {
        reduced.push('\'' + item.value + '\'');
      }
    } else {
      reduced.push('data.' + item.name);
    }
    return reduced;
  }, []);
  return new Function('data', 'var stack = [];\n' + reduced.map(function(item) {
    return 'stack.push(' + item + ');'
  }).join('\n') + '\nreturn stack.join(\'\');');
};

module.exports.compile = compile;
