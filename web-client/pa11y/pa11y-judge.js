const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/reports/judge-activity-report',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/search',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/search/no-matches',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #advanced-search-button to be visible',
      'set field #petitioner-name to cairo',
      'click element #advanced-search-button',
      'wait for .search-results to be visible',
    ],
    notes: 'checks a11y of advanced search results table',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/search&info=practitioner-tab',
      'wait for #tab-practitioner to be visible',
      'click element #tab-practitioner',
      'wait for #practitioner-name to be visible',
    ],
    notes: 'checks a11y of advanced search practitioner tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/trial-sessions',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #add-procedural-note-button to be visible',
      'click element #add-procedural-note-button',
    ],
    notes: 'checks a11y of add/edit procedural note modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/case-detail/112-19',
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #delete-procedural-note-button to be visible',
      'click element #delete-procedural-note-button',
    ],
    notes: 'checks a11y of delete procedural note modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      'wait for #print-session-working-copy to be visible',
      'click element #print-session-working-copy',
      'wait for .modal-screen to be visible',
      'click element #modal-button-confirm',
    ],
    notes: 'checks a11y of print trial session working copy modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/',
      'wait for [data-testid="tab-case-worksheets"] to be visible',
      'click element [data-testid="tab-case-worksheets"]',
      'wait for button[data-testid="add-edit-case-worksheet"] to be visible',
      'click element button[data-testid="add-edit-case-worksheet"]',
      'wait for .modal-screen to be visible',
      'click element #confirm',
    ],
    notes:
      'checks a11y of add/edit case worksheet modal in case worksheets tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'judgecolvin@example.com' }),
      'navigate to http://localhost:1234/',
      'wait for [data-testid="tab-pending-motions"] to be visible',
      'click element [data-testid="tab-pending-motions"]',
      'wait for button[data-testid="add-edit-pending-motion-worksheet"] to be visible',
      'click element button[data-testid="add-edit-pending-motion-worksheet"]',
      'wait for .modal-screen to be visible',
      'click element #confirm',
    ],
    notes:
      'checks a11y of add/edit pending motion worksheet modal in pending motions tab',
    url: 'http://localhost:1234/',
  },
];
