const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'colvinschambers@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  // 'http://localhost:1234/case-detail/105-20/documents/3eb53932-1a44-40d1-bfb8-d9e908b0b32e/apply-stamp', This NEVER actually ran this URL.
];
