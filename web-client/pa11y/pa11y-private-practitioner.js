module.exports = [
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/user/contact/edit',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/105-19',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/file-a-petition/step-1',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/102-19/request-access',
  {
    actions: [
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
      'wait for element .supporting-document-certificate-of-service-date to be visible',
    ],
    notes: ['request access with supporting document'],
    url:
      'http://localhost:1234/mock-login?token=privatePractitioner&path=/case-detail/102-19/request-access&info=supporting-document',
  },
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/search/no-matches',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/my-account',
  'http://localhost:1234/mock-login?token=privatePractitioner&path=/change-login-and-service-email',
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
