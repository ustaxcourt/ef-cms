module.exports = [
  'http://localhost:1234/login',
  'http://localhost:1234/create-account/petitioner',
  {
    actions: [
      'wait for #email to be visible',
      `set field #email to example${Date.now()}@pa11y.com`,
      'wait for #name to be visible',
      'set field #name to pa11y',
      'wait for #password to be visible',
      'set field #password to aA1!aaaa',
      'wait for #confirm-password to be visible',
      'set field #confirm-password to aA1!aaaa',
      'click element #submit-button',
      'wait for #verification-sent-message to be visible',
    ],
    notes: 'checks a11y of create petitioner account success message',
    url: 'http://localhost:1234/create-account/petitioner',
  },
  'http://localhost:1234/forgot-password',
  {
    actions: [
      'wait for [data-testid="email-input"] to be visible',
      `set field [data-testid="email-input"] to example${Date.now()}@pa11y.com`,
    ],
    notes: 'checks a11y of reset password page',
    url: 'http://localhost:1234/forgot-password',
  },
];
