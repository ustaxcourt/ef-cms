var macros  = require('./macros');

//
// Our `sets` tests
// Should match `tests/fixtures/sets.json`
//
macros.matchFixturesTest('sets', function runTest(connection) {
  connection.set('set1.foo', 765);
  connection.set('set1.bar', 567);
});