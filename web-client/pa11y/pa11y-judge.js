module.exports = [
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/reports/judge-activity-report',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/search',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/search/no-matches',
  {
    actions: [
      'wait for #advanced-search-button to be visible',
      'set field #petitioner-name to cairo',
      'click element #advanced-search-button',
      'wait for .search-results to be visible',
    ],
    notes: 'checks a11y of advanced search results table',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/search',
  },
  {
    actions: [
      'wait for #tab-practitioner to be visible',
      'click element #tab-practitioner',
      'wait for #practitioner-name to be visible',
    ],
    notes: 'checks a11y of advanced search practitioner tab',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/search&info=practitioner-tab',
  },
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/trial-sessions',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/trial-sessions',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc&info=calendared-case',
  'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  {
    actions: [
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #add-procedural-note-button to be visible',
      'click element #add-procedural-note-button',
    ],
    notes: 'checks a11y of add/edit procedural note modal',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/case-detail/101-19&info=add-edit-procedural-note-modal',
  },
  {
    actions: [
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #delete-procedural-note-button to be visible',
      'click element #delete-procedural-note-button',
    ],
    notes: 'checks a11y of delete procedural note modal',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/case-detail/112-19&info=delete-procedural-note-modal',
  },
  {
    actions: [
      'wait for #print-session-working-copy to be visible',
      'click element #print-session-working-copy',
      'wait for .modal-screen to be visible',
      'click element #modal-button-confirm',
    ],
    notes: 'checks a11y of print trial session working copy modal',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  },
  {
    actions: [
      'wait for button[data-testid="add-edit-case-worksheet"] to be visible',
      'click element button[data-testid="add-edit-case-worksheet"]',
      'wait for .modal-screen to be visible',
      'click element #confirm',
    ],
    notes: 'checks a11y of add/edit case worksheet modal',
    url: 'http://localhost:1234/log-in?code=judgecolvin@example.com&path=/',
  },
];
