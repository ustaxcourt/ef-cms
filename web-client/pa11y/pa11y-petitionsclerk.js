module.exports = [
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/start-a-case',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19',
  {
    actions: [
      'wait for #tab-case-info to be visible',
      'click element #tab-case-info',
    ],
    notes: 'checks a11y of case information tab panel',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=tab-case-info',
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
      'wait for #caption-edit-button to be visible',
      'click element #caption-edit-button',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks a11y of case caption edit dialog',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=case-caption-edit',
  },
  {
    actions: [
      'wait for #tab-pending-messages to be visible',
      'click element #tab-pending-messages',
      'wait for #create-message-button to be visible',
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
];
