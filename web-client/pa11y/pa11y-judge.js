module.exports = [
  'http://localhost:1234/mock-login?token=judgeArmen&path=/',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/search',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/search/no-matches',
  {
    actions: [
      'wait for #advanced-search-button to be visible',
      'click element #advanced-search-button',
      'wait for .search-results to be visible',
    ],
    notes: 'checks a11y of advanced search results table',
    url:
      'http://localhost:1234/mock-login?token=judgeArmen&path=/search?petitionerName=cairo',
  },
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-sessions',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc&info=calendared-case',
  'http://localhost:1234/mock-login?token=judgeArmen&path=/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
  {
    actions: [
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #add-procedural-note-button to be visible',
      'click element #add-procedural-note-button',
    ],
    notes: 'checks a11y of add/edit procedural note modal',
    url:
      'http://localhost:1234/mock-login?token=judgeArmen&path=/case-detail/101-19&info=add-edit-procedural-note-modal',
  },
  {
    actions: [
      'wait for #tab-notes to be visible',
      'click element #tab-notes',
      'wait for #delete-procedural-note-button to be visible',
      'click element #delete-procedural-note-button',
    ],
    notes: 'checks a11y of delete procedural note modal',
    url:
      'http://localhost:1234/mock-login?token=judgeArmen&path=/case-detail/112-19&info=delete-procedural-note-modal',
  },
];
