module.exports = [
  'http://localhost:1234/mock-login?token=petitioner&path=/',
  'http://localhost:1234/mock-login?token=petitioner&path=/before-starting-a-case',
  'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-1',
  'http://localhost:1234/mock-login?token=petitioner&path=/my-account',
  'http://localhost:1234/mock-login?token=petitioner&path=/change-login-and-service-email',
  {
    actions: [
      'wait for element label#hasIrsNotice-0 to be visible',
      'click element label#hasIrsNotice-0',
      'wait for .case-type-select to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for Yes notice',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-2&info=reveal-hidden-elements-yes-notice',
  },
  {
    actions: [
      'wait for element label#hasIrsNotice-1 to be visible',
      'click element label#hasIrsNotice-1',
      'wait for .case-type-select to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for No notice',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-2&info=reveal-hidden-elements-no-notice',
  },
  {
    actions: [
      'wait for element label#filing-type-0 to be visible',
      'click element label#filing-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Petitioner',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-petitioner',
  },
  {
    actions: [
      'wait for element label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for element label#is-spouse-deceased-0 to be visible',
      'click element label#is-spouse-deceased-0',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Petitioner & Deceased Spouse',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-petitioner-and-deceased-spouse',
  },
  {
    actions: [
      'wait for label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for label#is-spouse-deceased-0 to be visible',
      'click element label#is-spouse-deceased-0',
      'wait for .contactPrimary-country-type to be visible',
      'set field .contactPrimary-country-type to international',
      'check field .contactPrimary-country-type',
      'wait for .contactPrimary-country to be visible',
      'set field .contactSecondary-country-type to international',
      'check field .contactSecondary-country-type',
      'wait for .contactSecondary-country to be visible',
    ],
    notes: [
      'expose hidden elements on start-a-case for party type Petitioner & Deceased Spouse with international addresses',
      "Use 'set field' and then 'check field' to trigger the onChange event on the select",
    ],
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-petitioner-and-deceased-spouse-international',
  },
  {
    actions: [
      'wait for element label#filing-type-1 to be visible',
      'click element label#filing-type-1',
      'wait for element label#is-spouse-deceased-1 to be visible',
      'click element label#is-spouse-deceased-1',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Petitioner & Spouse',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-petitioner-and-spouse',
  },
  {
    actions: [
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-0 to be visible',
      'click element label#is-business-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Corporation',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-corporation',
  },
  {
    actions: [
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-1 to be visible',
      'click element label#is-business-type-1',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (Tax Matters)',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-partnership-tax-matters',
  },
  {
    actions: [
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-2 to be visible',
      'click element label#is-business-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (Other Than Tax Matters)',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-partnership-other',
  },
  {
    actions: [
      'wait for element label#filing-type-2 to be visible',
      'click element label#filing-type-2',
      'wait for element label#is-business-type-3 to be visible',
      'click element label#is-business-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Partnership (BBA)',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-partnership-bba',
  },
  {
    actions: [
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
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-estate-with-executor',
  },
  {
    actions: [
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
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-estate-without-executor',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-0 to be visible',
      'click element label#is-other-type-0',
      'wait for element label#is-estate-type-2 to be visible',
      'click element label#is-estate-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Trust',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-trust',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-0 to be visible',
      'click element label#is-minorIncompetent-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Conservator',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-conservator',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-1 to be visible',
      'click element label#is-minorIncompetent-type-1',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Guardian',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-guardian',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-2 to be visible',
      'click element label#is-minorIncompetent-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Custodian',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-custodian',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-1 to be visible',
      'click element label#is-other-type-1',
      'wait for element label#is-minorIncompetent-type-3 to be visible',
      'click element label#is-minorIncompetent-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Minor',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-minor',
  },
  {
    actions: [
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
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-incompetent-person',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-2 to be visible',
      'click element label#is-other-type-2',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Donor',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-donor',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-3 to be visible',
      'click element label#is-other-type-3',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Transferee',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-transferee',
  },
  {
    actions: [
      'wait for element label#filing-type-3 to be visible',
      'click element label#filing-type-3',
      'wait for element label#is-other-type-4 to be visible',
      'click element label#is-other-type-4',
      'wait for element .contact-group to be visible',
    ],
    notes:
      'expose hidden elements on start-a-case for party type Surviving Spouse',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-3&info=reveal-hidden-elements-surviving-spouse',
  },
  {
    actions: [
      'wait for button.case-difference to be visible',
      'wait for #case-difference-container to be hidden',
      'click element button.case-difference',
      'wait for #case-difference-container to be visible',
      'wait for label#procedure-type-0 to be visible',
      'click element label#procedure-type-0',
      'wait for #preferred-trial-city to be visible',
    ],
    notes: 'expose all hidden elements on start-a-case',
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/file-a-petition-pa11y/step-4&info=reveal-hidden-elements',
  },
  'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19',
  'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/file-a-document',
  'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/file-a-document/review',
  {
    actions: [
      'wait for element #react-select-2-input to be visible',
      'click #react-select-2-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-2-option-84', //Motion for Leave to File
    ],
    notes: [
      'Check accessibility of elements after choosing a Nonstandard H document',
    ],
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/file-a-document&info=doctype-selection-1',
  },
  {
    actions: [
      'wait for element #react-select-2-input to be visible',
      'click #react-select-2-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-2-option-49', //Motion for Leave to File Out of Time
      'wait for element #react-select-3-input to be visible',
      'click #react-select-3-input',
      'wait for element .select-react-element__menu to be visible',
      'click #react-select-3-option-37', //Motion for Continuance
      'wait for element #submit-document to be visible',
      'click #submit-document',
      'wait for element #primary-document to be visible',
      'click #primaryDocument-certificateOfService-label',
      'wait for element .primaryDocument-service-date to be visible',
      'wait for element #secondary-document to be visible',
    ],
    notes: ['File a document, step 2'],
    url: 'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/file-a-document&info=doctype-selection-2',
  },
  {
    actions: [
      'wait for element #case-list to be visible',
      'wait for element #pay_filing_fee to be visible',
      'click element .payment-options',
      'wait for element a.usa-link--external to be visible',
    ],
    notes: [
      'Check accessibility of view filing fee payment options with filed cases',
    ],
    url: 'http://localhost:1234/mock-login?token=petitioner&path=',
  },
  {
    actions: [
      'wait for element #pay_filing_fee to be visible',
      'click element #pay_filing_fee',
    ],
    notes: ['Check accessibility of Pay filing fee button'],
    url: 'http://localhost:1234/mock-login?token=petitioner&path=',
  },
  'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/contacts/primary/edit',
  'http://localhost:1234/mock-login?token=petitioner&path=/case-detail/101-19/contacts/secondary/edit',
];
