var test = require("tape").test

var isNumber = require("../")

test("numbers", function (t) {
  var ok = [0, -1231.21, 200, Math.pow(2, 53), Number.MAX_VALUE, Number.MIN_VALUE, 351351.13515151,
            031, 0xff, "121", "122.1251"]
  var notOk = [null, undefined, "cat", "dog", {}, {foo: "bar"}, [1,2,3], new Buffer("abc"),
               Infinity, function () {}]

  ok.forEach(function (n) {
    t.ok(isNumber(n), "This is in fact a number.")
  })

  notOk.forEach(function (o) {
    t.notOk(isNumber(o), "This is not a number.")
  })

  t.end()
})