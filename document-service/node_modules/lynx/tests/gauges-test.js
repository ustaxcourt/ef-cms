var macros  = require('./macros');

//
// Our `gauges` tests
// Should match `tests/fixtures/gauges.json`
//
macros.matchFixturesTest('gauges', function runTest(connection) {
  connection.gauge('foo.gauge.1', 500);
  connection.gauge('foo.gauge.2', 15);
});