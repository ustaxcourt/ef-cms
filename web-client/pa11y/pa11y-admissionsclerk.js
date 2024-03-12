const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/users/create-practitioner',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/users/edit-practitioner/PT1234',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/practitioner-detail/PT1234?tab=practitioner-documentation',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/practitioner-detail/PT1234/add-document',
      'wait for #cancel-button to be visible',
      'click element #cancel-button',
      'wait for dialog to be visible',
    ],
    notes: 'checks the add practitioner document page and the cancel modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/124-20/edit-petitioner-information/d2fadb14-b0bb-4019-b6b1-cb51cb1cb92f',
      'wait for #updatedEmail to be visible',
      'set field #updatedEmail to petitioner1@example.com',
      'set field #confirm-email to petitioner1@example.com',
      'click element #submit-edit-petitioner-information',
      'wait for #matching-email-modal to be visible',
    ],
    notes: 'checks a11y of matching email confirm modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'admissionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-20/edit-petitioner-information/f7272c25-99e1-4448-960e-e2a6b86e7d17',
      'wait for #updatedEmail to be visible',
      'set field #updatedEmail to available@example.com',
      'set field #confirm-email to available@example.com',
      'click element #submit-edit-petitioner-information',
      'wait for #no-matching-email-modal to be visible',
    ],
    notes: 'checks a11y of no matching email confirm modal',
    url: 'http://localhost:1234/',
  },
];
