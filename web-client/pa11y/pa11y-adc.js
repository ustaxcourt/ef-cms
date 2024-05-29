const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [...loginAs({ username: 'adc@example.com' })], // 10382: just messages/my/inbox no need to test
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'adc@example.com' }), // DONE
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    url: 'http://localhost:1234/',
  },
];
