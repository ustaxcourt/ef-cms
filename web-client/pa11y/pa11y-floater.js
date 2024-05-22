const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'floater@example.com' })],
    url: 'http://localhost:1234/',
  },
];
