var macros  = require('./macros');

//
// Our `counting` tests
// Should match `tests/fixtures/counting.json`
//
macros.matchFixturesTest('scopes', function runTest(connection) {
  connection.increment('bar');
  connection.decrement('baz');
  connection.decrement(['uno', 'two', 'trezentos']);
  connection.count('boaz', 101);
});
