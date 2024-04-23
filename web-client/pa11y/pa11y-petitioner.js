const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/before-starting-a-case',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-1',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/my-account',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/change-login-and-service-email',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-2',
      'wait for element label#hasIrsNotice-0 to be visible',
      'click element label#hasIrsNotice-0',
      'wait for .case-type-select to be visible',
      'wait for element label#atp-file-upload-label to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for Yes notice',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-2',
      'wait for element label#hasIrsNotice-1 to be visible',
      'click element label#hasIrsNotice-1',
      'wait for .case-type-select to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for No notice',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-0 to be visible',
      'click element label#filing-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Petitioner',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for element label#is-spouse-deceased-0 to be visible',
      'click element label#is-spouse-deceased-0',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Petitioner & Deceased Spouse',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for label#is-spouse-deceased-0 to be visible',
      'click element label#is-spouse-deceased-0',
      'wait for input#contactPrimary-countryType-domestic to be visible',
      'click element label#contactPrimary-country-radio-label-international',
      'wait for element .contactPrimary-country to be visible',
      'wait for input#contactSecondary-countryType-domestic to be visible',
      'click element label#contactSecondary-country-radio-label-international',
      'wait for element .contactSecondary-country to be visible',
    ],
    notes: [
      'expose hidden elements on start-a-case for party type Petitioner & Deceased Spouse with international addresses',
      "Use 'set field' and then 'check field' to trigger the onChange event on the select",
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for element label#is-spouse-deceased-1 to be visible',
      'click element label#is-spouse-deceased-1',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Petitioner & Spouse',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-0 to be visible',
      'click element label#is-business-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Corporation',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-1 to be visible',
      'click element label#is-business-type-1',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (Tax Matters)',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-2 to be visible',
      'click element label#is-business-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (Other Than Tax Matters)',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-3 to be visible',
      'click element label#is-business-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (BBA)',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-0 to be visible',
      'click element label#is-other-type-0',
      'wait for element label#is-estate-type-0 to be visible',
      'click element label#is-estate-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Estate With Executor',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-0 to be visible',
      'click element label#is-other-type-0',
      'wait for element label#is-estate-type-1 to be visible',
      'click element label#is-estate-type-1',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Estate Without Executor',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-0 to be visible',
      'click element label#is-other-type-0',
      'wait for element label#is-estate-type-2 to be visible',
      'click element label#is-estate-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Trust',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-0 to be visible',
      'click element label#is-minorIncompetent-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Conservator',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-1 to be visible',
      'click element label#is-minorIncompetent-type-1',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Guardian',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-2 to be visible',
      'click element label#is-minorIncompetent-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Custodian',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-3 to be visible',
      'click element label#is-minorIncompetent-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Minor',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-4 to be visible',
      'click element label#is-minorIncompetent-type-4',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Legally Incompetent Person',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-2 to be visible',
      'click element label#is-other-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Donor',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-3 to be visible',
      'click element label#is-other-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Transferee',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-3',
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-4 to be visible',
      'click element label#is-other-type-4',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Surviving Spouse',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/file-a-petition-pa11y/step-4',
      'wait for button.case-difference to be visible',
      'wait for #case-difference-container to be hidden',
      'click element button.case-difference',
      'wait for #case-difference-container to be visible',
      'wait for label#procedure-type-0 to be visible',
      'click element label#procedure-type-0',
      'wait for #preferred-trial-city to be visible',
    ],
    notes: 'expose all hidden elements on start-a-case',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/file-a-document',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/file-a-document/review',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/file-a-document',
      'wait for element #react-select-2-input to be visible',
      'click #react-select-2-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-2-option-84', //Motion for Leave to File
    ],
    notes: [
      'Check accessibility of elements after choosing a Nonstandard H document',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/file-a-document',
      'wait for element #document-type to be visible',
      'click #document-type',
      'set field #document-type input to Motion for Leave to File Out of Time',
      'click #document-type #react-select-2-option-0',
      'wait for element #secondary-doc-secondary-document-type to be visible',
      'click #secondary-doc-secondary-document-type',
      'set field #secondary-doc-secondary-document-type input to Motion for Continuance',
      'click #secondary-doc-secondary-document-type #react-select-3-option-0',
      'click #submit-document',
      'wait for element #primary-document to be visible',
      'click #primaryDocument-certificateOfService-label',
      'wait for element #primaryDocument-service-date-picker to be visible',
      'wait for element #secondary-document to be visible',
    ],
    notes: ['File a document, step 2'],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'wait for element #case-list to be visible',
      'wait for element #pay_filing_fee to be visible',
      'click element .payment-options',
      'wait for element a.usa-link--external to be visible',
    ],
    notes: [
      'Check accessibility of view filing fee payment options with filed cases',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'wait for element #pay_filing_fee to be visible',
      'click element #pay_filing_fee',
    ],
    notes: ['Check accessibility of Pay filing fee button'],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/contacts/primary/edit',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/contacts/secondary/edit',
    ],
    url: 'http://localhost:1234/',
  },
];
