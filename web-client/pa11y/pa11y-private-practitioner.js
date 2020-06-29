module.exports = [
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/user/contact/edit',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/105-19',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/file-a-petition/step-1',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/102-19/request-access',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/search/no-matches',
  {
    actions: [
      'wait for #tab-closed to be visible',
      'click element #tab-closed',
      'wait for element #tabContent-closed to be visible',
    ],
    notes: 'check the a11y of the Closed Cases tab',
    url: 'http://localhost:1234/mock-login?token=privatePractitioner&path=/',
  },
];
