module.exports = [
  'http://localhost:1234/mock-login?token=admissionsclerk&path=/users/create-practitioner',
  'http://localhost:1234/mock-login?token=admissionsclerk&path=/users/edit-practitioner/PT1234',
  {
    actions: [
      'wait for #updatedEmail to be visible',
      'set field #updatedEmail to petitioner1@example.com',
      'set field #confirm-email to petitioner1@example.com',
      'click element #submit-edit-petitioner-information',
      'wait for #matching-email-modal to be visible',
    ],
    notes: 'checks a11y of matching email confirm modal',
    url:
      'http://localhost:1234/mock-login?token=admissionsclerk&path=/case-detail/124-20/edit-petitioner-information/d2fadb14-b0bb-4019-b6b1-cb51cb1cb92f&info=matching-email-modal',
  },
  {
    actions: [
      'wait for #updatedEmail to be visible',
      'set field #updatedEmail to available@example.com',
      'set field #confirm-email to available@example.com',
      'click element #submit-edit-petitioner-information',
      'wait for #no-matching-email-modal to be visible',
    ],
    notes: 'checks a11y of no matching email confirm modal',
    url:
      'http://localhost:1234/mock-login?token=admissionsclerk&path=/case-detail/104-20/edit-petitioner-information/f7272c25-99e1-4448-960e-e2a6b86e7d17&info=no-matching-email-modal',
  },
];
