module.exports = [
  {
    actions: ['wait for .todays-orders to be visible'], // DONE
    notes: 'checks a11y of todays orders',
    url: 'http://localhost:5678/todays-orders',
  },
  'http://localhost:5678/todays-opinions', // DONE
  'http://localhost:5678/health', // DONE
  'http://localhost:5678/contact', // DONE
  'http://localhost:5678/privacy', // DONE
  'http://localhost:5678/email-verification-success', // SKIPPED, DOESN'T EXIST
  'http://localhost:5678/email-verification-instructions', // DONE
  'http://localhost:5678/maintenance', // DONE
];
