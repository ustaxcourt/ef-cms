const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'general@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
];
