# jadeite

Jadeite is a [Jade](http://jade-lang.com/)-like template language, and it's actually valid JavaScript.

## Install

*Unstable, use at your own risk*

This package uses the **[(old) Proxy API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Old_Proxy_API)**,
so you need *v0.11* node (and `--harmony` flags) or a decent browser (Harmony enabled).

With `npm` do

```
$ npm install jadeite
```

## Usage

Write your template function:

```js
function myTemplate(magic) {
  with(magic) { // with is needed if you want to omit property access
    return html
      (head
        (title
          ('Welcome on my Awesome site!')
        )
        (script(type = 'text/javascript', src = '/bundle.js') //very named arguments :o
        )
      )
      (body
        (h1
          (a(href = link) // wow, so variable attributes!
            (linkText) // such variable content
          )
          (input()) // empty tag, function call needed, or it will be substituted with the `input` variable
        )
      );
  }
}
```

Compile it, and it's ready to use:

```
var jadeite = require('jadeite');
var template = jadeite(myTemplate);

console.log(template({
  link: '/home',
  linkText: 'Hello world!'
}));
// <html><head><title>Welcome on my Awesome site!</title><script type="text/javascript" src="/bundle.js" /></head><body><h1><a href="/home">Hello world!</a><input /></h1></body></html>
```

## API

### jadeite(fn)

`fn` is a template function that accepts one parameter, like in the example. It return the compiled template, the example (`myTemplate`) will compile to this:

```js
function(data) {
  var stack = [];
  stack.push('<html><head><title>Welcome on my Awesome site!</title><script type="text/javascript" src="/bundle.js" /></head><body><h1><a href="');
  stack.push(data.link);
  stack.push('">');
  stack.push(data.linkText);
  stack.push('</a><input /></h1></body></html>');
  return stack.join('');  
}
```

## Plans

- Conditionals: `when(condition)(/* do this */)(otherwise(/* do this*/))`
- Loops: `each(item in items)(li(item))`
- Unicorns
