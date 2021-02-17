module.exports = [
  'http://localhost:1234/mock-login?token=admissionsclerk&path=/users/create-practitioner',
  'http://localhost:1234/mock-login?token=admissionsclerk&path=/users/edit-practitioner/PT1234',
  'http://localhost:1234/mock-login?token=admissionsclerk&path=/case-detail/124-20/edit-petitioner-information',
  {
    actions: [
      'wait for #contactPrimary.email to be visible',
      'set field #contactPrimary.email to petitioner1@example.com',
      'set field #contactPrimary.confirmEmail to petitioner1@example.com',
      'click element #submit-edit-petitioner-information',
      'wait for #matching-email-modal to be visible',
    ],
    notes: 'checks a11y of matching email confirm modal',
    url:
      'http://localhost:1234/mock-login?token=admissionsclerk&path=/case-detail/124-20/edit-petitioner-information?info=matching-email-modal',
  },
];
