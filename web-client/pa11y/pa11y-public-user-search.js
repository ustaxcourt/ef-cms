module.exports = [
  {
    actions: [
      'wait for #tab-case to be visible', // DONE
      'set field #docket-number to 103-20',
      'click element button#docket-search-button',
      'wait for table.ustc-table to be visible',
    ],
    notes: 'checks a11y of advanced case search',
    url: 'http://localhost:5678/',
  },
  {
    actions: [
      'wait for [data-testid="order-search-tab"] to be visible', // DONE
      'click element [data-testid="order-search-tab"]',
      'wait for #clear-search to be visible',
      'click element #clear-search',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to dismissal',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'wait for #startDate-date-start to be visible',
      'set field #startDate-date-start to 08/01/2001',
      'check field #startDate-date-start',
      'wait for button#advanced-search-button to be visible',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search',
    timeout: 80001,
    url: 'http://localhost:5678/',
  },
  {
    actions: [
      'wait for [data-testid="order-search-tab"] to be visible', // DONE
      'click element [data-testid="order-search-tab"]',
      'wait for #clear-search to be visible',
      'click element #clear-search',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to meow',
      'wait for button#advanced-search-button to be visible',
      'click element button#advanced-search-button',
      'wait for #no-search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search with no results',
    timeout: 80000,
    url: 'http://localhost:5678/',
  },
  {
    actions: [
      'wait for [data-testid="opinion-search-tab"] to be visible', // DONE
      'click element [data-testid="opinion-search-tab"]',
      'wait for #clear-search to be visible',
      'click element #clear-search',
      'wait for #keyword-search to be visible',
      'set field #keyword-search to sunglasses',
      'wait for #date-range to be visible',
      'set field #date-range to customDates',
      'check field #date-range',
      'wait for #startDate-date-start to be visible',
      'set field #startDate-date-start to 08/01/2001',
      'check field #startDate-date-start',
      'wait for button#advanced-search-button to be visible',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced opinion search with results on sealed case',
    url: 'http://localhost:5678/',
  },
];
