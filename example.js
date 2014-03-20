var _ = require('./');

function myTemplate(magic) {
  with(magic) { // with is needed if you want to omit property access
    return html
      (head
        (title
          ('Welcome on my Awesome site!')
        )
        (script(type = 'text/javascript', src = '/bundle.js')
        )
      )
      (body
        (h1
          (a(href = link)
            (linkText)
          )
          (input())
          (iff(cond)
            ('true!')
          )
        )
      );
  }
}

console.log(_(myTemplate).toString());
console.log(_(myTemplate)({
  link: '/home',
  linkText: 'Hello world!',
  cond: true
}));
