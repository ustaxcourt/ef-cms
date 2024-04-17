const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'adc@example.com' })],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'adc@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    url: 'http://localhost:1234/',
  },
];
