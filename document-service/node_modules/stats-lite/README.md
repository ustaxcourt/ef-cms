stats-lite
=====

[![NPM](https://nodei.co/npm/stats-lite.png)](https://nodei.co/npm/stats-lite/)

A fairly light statistical package. Works with numeric arrays, and will automatically filter out non-numeric values and attempt to convert string numeric values.

## Install

```
 npm install stats-lite --save
```

Example
---

[Live Demo using Browserify!](http://requirebin.com/embed?gist=brycebaril/9591291)

```javascript
var stats = require("stats-lite")

var dice = require("dice")

var rolls = []
for (var i = 0; i < 3000; i++) {
  rolls.push(dice.sum(dice.roll("2d6")))
}

console.log("sum: %s", stats.sum(rolls))
console.log("mean: %s", stats.mean(rolls))
console.log("median: %s", stats.median(rolls))
console.log("mode: %s", stats.mode(rolls))
console.log("variance: %s", stats.variance(rolls))
console.log("standard deviation: %s", stats.stdev(rolls))
console.log("sample standard deviation: %s", stats.sampleStdev(rolls))
console.log("85th percentile: %s", stats.percentile(rolls, 0.85))
console.log("histogram:", stats.histogram(rolls, 10))

/* Your exact numbers may vary, but they should be pretty similar:
sum: 21041
mean: 7.0136666666666665
median: 7
mode: 7
variance: 5.8568132222220415
standard deviation: 2.4200853749861886
sample standard deviation: 2.4204888234135953
85th percentile: 10
histogram { values: [ 94, 163, 212, 357, 925, 406, 330, 264, 164, 85 ],
  bins: 10,
  binWidth: 1.05,
  binLimits: [ 1.75, 12.25 ] }
*/

```

**Compatibility Notice**: Version 2.0.0+ of this library use features that require Node.js v4.0.0 and above

API
===

All of the exported functions take `vals` which is an array of numeric values. Non-numeric values will be removed, and string numbers will be converted to Numbers.

**NOTE**: This will impact some operations, e.g. `mean([null, 1, 2, 3])` will be calculated as `mean([1, 2, 3])`, (e.g. `6 / 3 = 2`, NOT `6 / 4 = 1.5`)

`numbers(vals)`
---

Accepts an array of values and returns an array consisting of only numeric values from the source array. Converts what it can and filters out anything else. e.g.

```js
numbers(["cat", 1, "22.9", 9])
// [1, 22.9, 9]
```

`sum(vals)`
---

[Sum](http://en.wikipedia.org/wiki/Summation) the values in the array.

`mean(vals)`
---

Calculate the [mean](http://en.wikipedia.org/wiki/Mean) average value of `vals`.

`median(vals)`
---

Calculate the [median](http://en.wikipedia.org/wiki/Median) average value of `vals`.

`mode(vals)`
---

Calculate the [mode](http://en.wikipedia.org/wiki/Mode_statistics) average value of `vals`.

If `vals` is multi-modal (contains multiple modes), `mode(vals)` will return a ES6 Set of the modes.

`variance(vals)`
---

Calculate the [variance](http://en.wikipedia.org/wiki/Variance) from the mean for a population.

`stdev(vals)`
---

Calculate the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) of the values from the mean for a population.

`sampleVariance(vals)`
---

Calculate the [variance](http://en.wikipedia.org/wiki/Variance) from the mean for a sample.

`sampleStdev(vals)`
---

Calculate the [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation) of the values from the mean for a sample.


`percentile(vals, ptile)`
---

Calculate the value representing the desired [percentile](http://en.wikipedia.org/wiki/Percentile) `(0 < ptile <= 1)`. Uses the Estimation method to interpolate non-member percentiles.

`histogram(vals[, bins])`
---

Build a histogram representing the distribution of the data in the provided number of `bins`. If `bins` is not set, it will choose one based on `Math.sqrt(vals.length)`. Data will look like:
```
histogram {
  values: [ 86, 159, 253, 335, 907, 405, 339, 270, 146, 100 ],
  bins: 10,
  binWidth: 1.05,
  binLimits: [ 1.75, 12.25 ]
}
```
Where `values` are the bins and the counts of the original values falling in that range. The ranges can be calculated from the `binWidth` and `binLimits`. For example, the first bin `values[0]` in this example is from `1.75 < value <= 2.8`. The third bin `values[2]` would be `1.75 + (1.05 * 2) < value <= 1.75 + (1.05 * 3)` or `3.85 < value <= 4.9`.

LICENSE
=======

MIT
