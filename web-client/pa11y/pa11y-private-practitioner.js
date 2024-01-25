/* eslint-disable max-lines */
const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/user/contact/edit',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-19',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19/request-access',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19/request-access',
      'wait for element #react-select-2-input to be visible',
      'click #react-select-2-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-2-option-2', //Motion to Substitute Parties and Change Caption
      'wait for element #add-supporting-document-button to be visible',
      'click element #add-supporting-document-button',
      'wait for element #supporting-document-0 to be visible',
      'set field #supporting-document-0 to Affidavit in Support',
      'check field #supporting-document-0',
      'wait for element .supporting-document-certificate-of-service to be visible',
      'click .supporting-document-certificate-of-service',
      'wait for element #supportingDocuments-0-service-date-picker to be visible',
    ],
    notes: ['request access with supporting document'],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/search/no-matches',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/my-account',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/change-login-and-service-email',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'privatePractitioner@example.com' }),
      'navigate to http://localhost:1234/',
      'wait for #tab-closed to be visible',
      'click element #tab-closed',
      'wait for element #tabContent-closed to be visible',
    ],
    notes: 'check the a11y of the Closed Cases tab',
    url: 'http://localhost:1234/',
  },
];
