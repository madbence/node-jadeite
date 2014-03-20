# jadeite

Jadeite is a [Jade](http://jade-lang.com/)-like template language, and it's actually valid JavaScript.

Feedbacks are welcome!

## Features

- Variable substitution
- Compiled template (*fast!*)
- Conditionals

## Why?

- Because it's fun!

## Install

*Unstable, use at your own risk*

This package uses the *[(old) Proxy API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Old_Proxy_API)*,
so you need *v0.11* node (and `--harmony` flags) or a harmony enabled browser..

With `npm` do

```
$ npm install jadeite
```

## Usage

Write your template function:

```js
function myTemplate(magic) {
  with(magic) { // `with` is needed if you want to omit property access
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
          (a(href = link) // wow, so dynamic attributes!
            (linkText) // such dynamic content
          )
          (input()) // empty tag, function call needed, or it will be substituted with the `input` variable
          (iff(cond)
            ('true!')
          )
        )
      );
  }
}
```

Compile it, and it's ready to use:

```js
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
  var a = [];
  a.push('<html><head><title>Welcome on my Awesome site!</title><script type="text/javascript" src="/bundle.js" /></head><body><h1><a href="');
  a.push(data.link);
  a.push('">');
  a.push(data.linkText);
  a.push('</a><input />');
  if(data.cond) {
    a.push('true!');
  }
  a.push('</h1></body></html>');
  return a.join('');
}
```

## Plans

- Loops: `each(item in items)(li(item))`
- `jadeite < input.js` command
- Less parens *:)))*
- Unicorns

## License

MIT
