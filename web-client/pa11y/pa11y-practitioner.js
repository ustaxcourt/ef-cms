module.exports = [
  'http://localhost:1234/mock-login?token=practitioner&path=/',
  'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/105-19',
  'http://localhost:1234/mock-login?token=practitioner&path=/start-a-case',
  'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/102-19/request-access',
  {
    actions: [
      'wait for element #document-type to be visible',
      'set field #document-type to Substitution of Counsel',
      'check field #document-type',
      'set field #certificate-Yes to Yes',
      'check field #certificate-Yes',
      'wait for element #objections-Unknown to be visible',
      'set field #objections-Unknown to Unknown',
      'check field #objections-Unknown',
      'check field #party-primary',
    ],
    notes: 'fill out request-access form and review inputs',
    url:
      'http://localhost:1234/mock-login?token=practitioner&path=/case-detail/102-19/request-access&filled-form=true',
  },
];
