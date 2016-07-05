# stickymap

Sticky maps.

# the rough idea

```js
var map = stickymap({
  bbox: [-120, 40, -100, 60],
  layers: [
    {url: 'http://example.com/{z}/{x}/{y}.png'}
  ],
  width: 200
});

document.body.appendChild(map);
```

[![Build Status](https://travis-ci.org/tschaub/stickymap.svg?branch=master)](https://travis-ci.org/tschaub/stickymap)
