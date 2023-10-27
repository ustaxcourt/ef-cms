const random = Date.now();
module.exports = [
  {
    actions: ['wait for .todays-orders to be visible'],
    notes: 'checks a11y of todays orders',
    url: 'http://localhost:5678/todays-orders',
  },
  'http://localhost:5678/todays-opinions',
  'http://localhost:5678/health',
  'http://localhost:5678/contact',
  'http://localhost:5678/privacy',
  'http://localhost:5678/create-account/petitioner',
  {
    actions: [
      'wait for #email to be visible',
      `set field #email to example${random}@pa11y.com`,
      'wait for #name to be visible',
      'set field #name to pa11y',
      'wait for #password to be visible',
      'set field #password to aA1!aaaa',
      'wait for #confirm-password to be visible',
      'set field #confirm-password to aA1!aaaa',
      'click element #submit-button',
      'wait for #verification-sent-message to be visible',
    ],
    notes: 'checks a11y of advanced opinion search with results on sealed case',
    url: 'http://localhost:5678/create-account/petitioner',
  },
  'http://localhost:5678/email-verification-success',
  'http://localhost:5678/email-verification-instructions',
  'http://localhost:5678/maintenance',
];
