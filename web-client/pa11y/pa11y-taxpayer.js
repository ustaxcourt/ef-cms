module.exports = [
  'http://localhost:1234/mock-login?token=taxpayer&path=/',

  'http://localhost:1234/mock-login?token=taxpayer&path=/before-starting-a-case',

  'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case',
  {
    actions: [
      'wait for element label#hasIrsNotice-0 to be visible',
      'click element label#hasIrsNotice-0',
      'wait for .case-type-select to be visible',
      'wait for button.case-difference to be visible',
      'click element button.case-difference',
      'wait for #case-difference-container to be visible',
      'wait for label#proc-type-0 to be visible',
      'click element label#proc-type-0',
      'wait for #preferred-trial-city to be visible',
    ],
    notes: 'expose all hidden elements on start-a-case',
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements',
  },
  {
    actions: [
      'wait for element label#filing-type-0 to be visible',
      'click element label#filing-type-0',
      'wait for element .contact-group to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for party type Petitioner',
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-petitioner',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-petitioner-and-deceased-spouse',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-petitioner-and-deceased-spouse-international',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-petitioner-and-spouse',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-corporation',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-partnership-tax-matters',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-partnership-other',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-partnership-bba',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-estate-with-executor',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-estate-without-executor',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-trust',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-conservator',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-guardian',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-custodian',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-minor',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-incompetent-person',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-donor',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-transferee',
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
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-surviving-spouse',
  },
  {
    actions: [
      'wait for element label#hasIrsNotice-0 to be visible',
      'click element label#hasIrsNotice-0',
      'wait for .case-type-select to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for Yes notice',
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-yes-notice',
  },
  {
    actions: [
      'wait for element label#hasIrsNotice-1 to be visible',
      'click element label#hasIrsNotice-1',
      'wait for .case-type-select to be visible',
    ],
    notes: 'expose hidden elements on start-a-case for No notice',
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/start-a-case&info=reveal-hidden-elements-no-notice',
  },

  'http://localhost:1234/mock-login?token=taxpayer&path=/case-detail/101-19',
  'http://localhost:1234/mock-login?token=taxpayer&path=/case-detail/101-19/file-a-document',
  {
    actions: [
      'wait for element #document-category to be visible',
      'set field #document-category to Motion',
      'check field #document-category',
      'wait for element #document-type to be visible',
    ],
    notes: [
      'Check accessibility of elements after choosing a document category',
      "Use 'set field' and then 'check field' to trigger the onChange event on the select",
    ],
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/case-detail/101-19/file-a-document&info=doctype-selection-1',
  },
  {
    actions: [
      'wait for element #document-category to be visible',
      'set field #document-category to Motion',
      'check field #document-category',
      'wait for element #document-type to be visible',
      'set field #document-type to Motion for Continuance',
      'check field #document-type',
      'wait for element #select-document to be visible',
      'click element #select-document',
      'wait for element #submit-document to be visible',
      'click #submit-document',
      'wait for element #primary-document to be visible',
      'click element #certificate-Yes+label',
      'click element #supporting-documents-Yes+label',
      'wait for element fieldset.service-date to be visible',
      'wait for element #supporting-document to be visible',
    ],
    notes: ['File a document, step 2'],
    url:
      'http://localhost:1234/mock-login?token=taxpayer&path=/case-detail/101-19/file-a-document&info=doctype-selection-2',
  },
];
