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
  'http://localhost:5678/email-verification-success',
  'http://localhost:5678/email-verification-instructions',
  'http://localhost:5678/maintenance',
];
