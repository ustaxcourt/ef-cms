const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'colvinschambers@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
];
