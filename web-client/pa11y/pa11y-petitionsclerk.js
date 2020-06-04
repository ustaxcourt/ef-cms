module.exports = [
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/',
  /* start case internal */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1',
  {
    actions: [
      'wait for #party-type to be visible',
      'set field #party-type to Surviving spouse',
      'check field #party-type',
      'wait for #secondary-name to be visible',
    ],
    notes:
      'checks a11y of Create Case with inputs revealed - secondary contact',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=secondary-contact',
  },
  {
    actions: [
      'wait for #party-type to be visible',
      'set field #party-type to Corporation',
      'check field #party-type',
      'wait for #order-for-ods to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - Order for ODS',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=order-for-ods',
  },
  {
    actions: [
      'wait for #tab-case-info to be visible',
      'click element #tab-case-info',
      'wait for #date-received-legend to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - Case Info tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=case-info-tab',
  },
  {
    actions: [
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-legend to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - IRS Notice tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=irs-notice-tab',
  },

  /* case detail */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
    ],
    notes: 'checks a11y of case information tab, overview secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/108-19&info=case-information-tab-overview',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-petitioner to be visible',
      'click element #tab-petitioner',
    ],
    notes: 'checks a11y of case information tab, petitioner secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=case-information-tab-petitioner',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-respondent to be visible',
      'click element #tab-respondent',
    ],
    notes: 'checks a11y of case information tab, respondent secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/107-19&info=case-information-tab-respondent',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-petitioner to be visible',
      'click element #tab-petitioner',
      'wait for #practitioner-search-field to be visible',
      'set field #practitioner-search-field to GL1111',
      'check field #practitioner-search-field',
      'click element button#search-for-practitioner',
      'wait for #counsel-matches-legend to be visible',
    ],
    notes: 'checks a11y of add practitioner modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=add-practitioner-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-petitioner to be visible',
      'click element #tab-petitioner',
      'wait for button#edit-privatePractitioners-button to be visible',
      'click element button#edit-privatePractitioners-button',
      'wait for #practitioner-representing-0 to be visible',
    ],
    notes: 'checks a11y of edit privatePractitioners modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=edit-privatePractitioners-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-respondent to be visible',
      'click element #tab-respondent',
      'wait for #respondent-search-field to be visible',
      'set field #respondent-search-field to WN7777',
      'check field #respondent-search-field',
      'click element button#search-for-respondent',
      'wait for #counsel-matches-legend to be visible',
    ],
    notes: 'checks a11y of add respondent modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=add-respondent-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-respondent to be visible',
      'click element #tab-respondent',
      'wait for button#edit-irsPractitioners-button to be visible',
      'click element button#edit-irsPractitioners-button',
      'wait for #respondent-0 to be visible',
    ],
    notes: 'checks a11y of edit irsPractitioners modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19&info=edit-irsPractitioners-modal',
  },
  {
    actions: [
      'wait for #tab-in-progress to be visible',
      'click element #tab-in-progress',
      'wait for button[data-document-id="25100ec6-eeeb-4e88-872f-c99fad1fe6c7"] to be visible',
      'click element button[data-document-id="25100ec6-eeeb-4e88-872f-c99fad1fe6c7"]',
    ],
    notes: 'checks the confirm modal when editing a signed draft document',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19&info=edit-signed-order-confirm-modal',
  },
  {
    actions: [
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-create-order to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-create-order',
      'wait for #eventCode to be visible',
    ],
    notes: 'checks a11y of create order select document type modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=create-order-modal',
  },
  {
    actions: [
      'wait for #tab-deadlines to be visible',
      'click element #tab-deadlines',
    ],
    notes: 'checks a11y of deadlines tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/107-19&info=deadlines-tab',
  },
  {
    actions: [
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-add-deadline to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-add-deadline',
      'wait for #deadline-date-legend to be visible',
    ],
    notes: 'checks a11y of add deadline modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=add-deadline',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #blocked-from-trial-header to be visible',
    ],
    notes:
      'checks a11y of case information overview tab for a case with a manual and automatic block',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=case-information-tab-blocked',
  },
  {
    actions: [
      'wait for #tab-in-progress to be visible',
      'click element #tab-in-progress',
    ],
    notes: 'checks a11y of in progress tab, draft documents secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=in-progress-tab-drafts',
  },
  {
    actions: [
      'wait for #tab-in-progress to be visible',
      'click element #tab-in-progress',
      'wait for #tab-messages to be visible',
      'click element #tab-messages',
    ],
    notes: 'checks a11y of in progress tab, messages secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=in-progress-tab-messages',
  },
  {
    actions: [
      'wait for #tab-in-progress to be visible',
      'click element #tab-in-progress',
      'wait for #tab-pending-report to be visible',
      'click element #tab-pending-report',
    ],
    notes: 'checks a11y of in progress tab, pending report secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=in-progress-tab-pending-report',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #remove-from-trial-session-btn to be visible',
      'click element #remove-from-trial-session-btn',
      'wait for #remove-from-trial-session-modal to be visible',
    ],
    notes: 'checks the remove from trial session modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/108-19&info=remove-case-from-session-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for .high-priority-btn to be visible',
      'click element .high-priority-btn',
      'wait for #prioritize-case-modal to be visible',
    ],
    notes: 'opens the prioritize case modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19&info=prioritize-case-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #remove-high-priority-btn to be visible',
      'click element #remove-high-priority-btn',
      'wait for #unprioritize-modal to be visible',
    ],
    notes: 'opens the unprioritize case modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/110-19&info=unprioritize-case-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #add-to-trial-session-btn to be visible',
      'click element #add-to-trial-session-btn',
      'wait for #add-to-trial-session-modal to be visible',
    ],
    notes: 'checks the add to trial session modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19&info=add-case-to-session-modal',
  },

  /* petition qc */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/petition-qc?tab=partyInfo',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/petition-qc?tab=caseInfo',
  {
    actions: [
      'wait for button#tab-irs-notice to be visible',
      'click element button#tab-irs-notice',
      'wait for label#has-irs-verified-notice-yes to be visible',
      'click element label#has-irs-verified-notice-yes',
      'wait for #date-of-notice-month to be visible',
    ],
    notes: 'checks a11y of editable fields exposed when Yes notice attached',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/petition-qc?tab=irsNotice&info=reveal-notice-options',
  },

  /* review petition */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b/review',

  /* document detail */
  {
    actions: [
      'wait for #tab-pending-messages to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #tab-pending-messages',
      'wait for #create-message-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #create-message-button',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks a11y of create message dialog',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73&info=create-message-dialog',
  },

  /* trial sessions */
  {
    actions: ['wait for #trial-sessions-tabs to be visible'],
    notes: 'checks a11y of trial sessions table list',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-sessions&info=list-trial-sessions',
  },
  {
    actions: ['wait for #start-date-month to be visible'],
    notes: 'checks a11y of trial sessions add form',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/add-a-trial-session&info=add-trial-session',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5&info=non-calendared-case',

  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/edit-order/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/sign',
  {
    actions: [
      'wait for #trial-location to be visible',
      'set field #trial-location to Birmingham, Alabama',
      'check field #trial-location',
    ],
    notes: 'checks the blocked cases screen',

    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/reports/blocked-cases&info=blocked-cases-alabama',
  },
  // this url probably needs to be moved to calendaring when those users are created
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/reports/case-deadlines',
  {
    actions: [
      'wait for #reports-btn to be visible',
      'click element #reports-btn',
      'wait for #trial-session-planning-btn to be visible',
      'click element #trial-session-planning-btn',
      'wait for .trial-session-planning-modal to be visible',
    ],
    notes: 'checks the trial session planning modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/search&info=trial-session-planning-modal',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/edit-trial-session/6b6975cf-2b10-4e84-bcae-91e162d2f9d1',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5&info=qc-complete-checkboxes',
  {
    actions: [
      'wait for #tab-practitioner to be visible',
      'click element #tab-practitioner',
      'wait for #practitioner-name to be visible',
      'set field #practitioner-name to test',
      'click element #practitioner-search-by-name-button',
      'wait for .search-results to be visible',
    ],
    notes: 'checks the advanced search practitioner tab and results table',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/search&info=practitioner-search-results',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/practitioner-detail/PT1234',
  {
    actions: [
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-legend to be visible',
      'set field #case-type to Deficiency',
      'check field #case-type',
      'wait for .calculate-penalties to be visible',
      'click element .calculate-penalties',
      'wait for .modal-screen to be visible',
    ],
    notes: 'checks the Calculate Penalties on IRS Notice modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=penalties-modal',
  },
];
