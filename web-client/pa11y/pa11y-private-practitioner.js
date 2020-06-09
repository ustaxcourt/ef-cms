module.exports = [
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/user/contact/edit',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/105-19',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/file-a-petition/step-1',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/102-19/request-access',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/search/no-matches',
  {
    actions: [
      'wait for #tab-open to be visible',
      'wait for #tab-closed to be visible',
    ],
    notes:
      'a private practitioner can see two tabs displaying open and closed cases',
    url: 'http://localhost:1234/mock-login?token=privatePractitioner&path=/',
  },
];
