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
    url: 'http://localhost:5678',
  },
];
