var specify = require('specify')
  , lynx    = require('../lib/lynx')
  ;

specify('errors', function (assert) {
  var connection = new lynx('locahost', 86875);
  connection.increment('a');
  assert.ok(true);
});

specify.run();