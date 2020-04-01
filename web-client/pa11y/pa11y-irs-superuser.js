module.exports = [
  {
    actions: [
      'wait for #docket-search-field to be visible',
      'set field #docket-search-field to 103-19',
      'click element .usa-search-submit-text',
      'wait for #case-title to be visible',
    ],
    notes: 'checks a11y of login and docket search',
    url: 'http://localhost:1234/mock-login?token=irsSuperuser&path=/',
  },
  {
    actions: [
      'wait for a#advanced-search-button to be visible',
      'click element #advanced-search-button',
      'wait for .advanced-search__form-container to be visible',
      'set field #petitioner-name to cairo',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
      'set field input#docket-number to 103-19',
      'click element button#docket-search-button',
      'wait for #case-title to be visible',
    ],
    notes: 'checks a11y of advanced docket search',
    url: 'http://localhost:1234/mock-login?token=irsSuperuser&path=/',
  },
];
