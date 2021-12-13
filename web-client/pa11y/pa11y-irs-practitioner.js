module.exports = [
  'http://localhost:1234/log-in?code=irsPractitioner@example.com&path=/',
  'http://localhost:1234/log-in?code=irsPractitioner@example.com&path=/case-detail/101-19',
  {
    actions: [
      'wait for #button-first-irs-document to be visible',
      'click element #button-first-irs-document',
      'wait for #file-a-document-header to be visible',
    ],
    notes: 'checks a11y of revealed form for filing document',
    url: 'http://localhost:1234/log-in?code=irsPractitioner@example.com&path=/case-detail/104-18&info=can-file-document',
  },
  {
    actions: [
      'wait for .sealed-banner to be visible',
      'wait for #case-title to be visible',
    ],
    notes: 'an associated respondent can see details of sealed case',
    url: 'http://localhost:1234/log-in?code=irsPractitioner@example.com&path=/case-detail/102-20&info=associated-respondent',
  },
  'http://localhost:1234/log-in?code=irsPractitioner@example.com&path=/search/no-matches',
];
