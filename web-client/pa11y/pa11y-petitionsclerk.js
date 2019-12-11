module.exports = [
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1',
  {
    actions: [
      'wait for #party-type to be visible',
      'set field #party-type to Surviving spouse',
      'check field #party-type',
      'wait for #secondary-name to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=reveal-file-a-petition-inputs',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
    ],
    notes: 'checks a11y of case information tab panel',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=tab-case-information',
  },
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
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/documents/89c781f6-71ba-4ead-93d8-c681c2183a73&info=reveal-notice-options',
  },
  {
    actions: [
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #tabContent-partyInfo to be visible',
    ],
    notes: 'check a11y of content within parties tab of document detail',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b&info=tab-parties',
  },
  {
    actions: [
      'wait for #tab-case-info to be visible',
      'click element #tab-case-info',
      'wait for #tabContent-caseInfo to be visible',
    ],
    notes: 'check a11y of content within case info tab of document detail',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b&info=tab-case-info',
  },
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
  {
    actions: ['wait for table#upcoming-sessions to be visible'],
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
  {
    actions: [
      'wait for #tab-in-progress to be visible',
      'click element #tab-in-progress',
      'wait for #button-create-order to be visible',
      'click element #button-create-order',
      'wait for #eventCode to be visible',
      'set field #eventCode to ODD',
      'check field #eventCode',
    ],
    notes: 'checks a11y of create order modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=create-order',
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
      'wait for button#edit-practitioners-button to be visible',
      'click element button#edit-practitioners-button',
      'wait for #practitioner-representing-0 to be visible',
    ],
    notes: 'checks a11y of edit practitioners modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=edit-practitioners-modal',
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
      'wait for button#edit-respondents-button to be visible',
      'click element button#edit-respondents-button',
      'wait for #respondent-0 to be visible',
    ],
    notes: 'checks a11y of edit respondents modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19&info=edit-respondents-modal',
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

  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/edit-order/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/sign',
  {
    actions: [
      'wait for #tab-deadlines to be visible',
      'click element #tab-deadlines',
      'wait for #button-add-deadline to be visible',
      'click element #button-add-deadline',
      'wait for #deadline-date-legend to be visible',
    ],
    notes: 'checks a11y of add deadline modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=add-deadline',
  },
  {
    actions: [
      'wait for ul.usa-list to be visible',
      'wait for #button-create-order to be visible',
    ],
    notes: 'checks a11y of orders needed summary',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/orders-needed&info=orders-needed-summary',
  },
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

  // this url probably needs to be moved to calendaring when those users are created
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5&info=non-calendared-case',
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
];
