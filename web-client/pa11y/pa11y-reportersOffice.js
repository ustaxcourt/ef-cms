const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'reportersoffice@example.com' })], // DONE
    url: 'http://localhost:1234/',
  },
];
