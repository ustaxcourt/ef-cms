isNumber
========

[![NPM](https://nodei.co/npm/isnumber.png)](https://nodei.co/npm/isnumber/)

`isNumber` is a super tiny module that provides a test to see if a value is a finite number.

By super tiny, I mean like a single line -- however, I tend to use this somewhat frequently, so module it is!

```js
var isNumber = require("isnumber")

isNumber(13) // true
isNumber("1241.12") // true
isNumber(0xff) // true

isNumber(Infinity) // false
isNumber("cat") // false
isNumber({foo: "bar"}) // false
```

LICENSE
=======

MIT