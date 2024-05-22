const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'general@example.com' })],
    url: 'http://localhost:1234/',
  },
];
