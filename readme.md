# `stickymap`

Sticky maps.

# the rough idea

```js
var img = sticky.img({
  bbox: [-120, 40, -100, 60],
  layers: [
    {url: 'http://example.com/{z}/{x}/{y}.png'}
  ],
  width: 200,
  height: 150
});

document.body.appendChild(img);
```

[![Build Status](https://travis-ci.org/tschaub/stickymap.svg?branch=master)](https://travis-ci.org/tschaub/stickymap)
