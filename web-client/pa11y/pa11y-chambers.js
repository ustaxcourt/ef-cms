const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'colvinschambers@example.com' })],
    url: 'http://localhost:1234/',
  },
];
