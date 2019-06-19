module.exports = [
  'http://localhost:1234/mock-login?token=respondent&path=/',
  'http://localhost:1234/mock-login?token=respondent&path=/case-detail/101-19',
  {
    actions: [
      'wait for #button-file-document to be visible',
      'click element #button-file-document',
      'wait for #file-a-document-header to be visible',
    ],
    notes: 'checks a11y of revealed form for filing document',
    url:
      'http://localhost:1234/mock-login?token=respondent&path=/case-detail/103-19&info=can-file-document',
  },
];
