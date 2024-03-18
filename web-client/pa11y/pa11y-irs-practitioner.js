const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'irspractitioner@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'irspractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'irspractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-18&info=can-file-document',
      'wait for #button-first-irs-document to be visible',
      'click element #button-first-irs-document',
      'wait for #file-a-document-header to be visible',
    ],
    notes: 'checks a11y of revealed form for filing document',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'irspractitioner@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-20&info=associated-respondent',
      'wait for .sealed-banner to be visible',
      'wait for #case-title to be visible',
    ],
    notes: 'an associated respondent can see details of sealed case',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'irspractitioner@example.com' }),
      'navigate to http://localhost:1234/search/no-matches',
    ],
    url: 'http://localhost:1234/',
  },
];
