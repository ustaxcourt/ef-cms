module.exports = [
  {
    actions: [
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #order-search to be visible',
      'set field #order-search to dismissal',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search',
    url: 'http://localhost:5678',
  },
  {
    actions: [
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #order-search to be visible',
      'set field #order-search to meow',
      'click element button#advanced-search-button',
      'wait for #no-search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search with no results',
    url: 'http://localhost:5678?info=no-results',
  },
  // TODO - This work will be part of #4837.
  //  Add this test back in when opinion search results filter out opinions that
  //  belong to a sealed case.
  // {
  //   actions: [
  //     'wait for #tab-opinion to be visible',
  //     'click element #tab-opinion',
  //     'wait for #opinion-search to be visible',
  //     'set field #opinion-search to sunglasses',
  //     'click element button#advanced-search-button',
  //     'wait for #no-search-results to be visible',
  //   ],
  //   notes: 'checks a11y of advanced opinion search with no results',
  //   url: 'http://localhost:5678?info=no-results',
  // },
];
