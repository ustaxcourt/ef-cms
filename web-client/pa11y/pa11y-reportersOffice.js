const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'reportersoffice@example.com' })],
    url: 'http://localhost:1234/',
  },
];
