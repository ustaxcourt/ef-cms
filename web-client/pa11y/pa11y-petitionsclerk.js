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
      'wait for #date-received-date-label to be visible',
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
      'wait for #date-of-notice-date-label to be visible',
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
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
    ],
    notes: 'checks a11y of case information tab, petitioner secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19&info=case-information-tab-parties',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #respondent-counsel to be visible',
      'click element #respondent-counsel',
      'wait for #edit-respondent-counsel to be visible',
      'click element #edit-respondent-counsel',
    ],
    notes:
      'checks a11y of case information tab, parties secondary tab, respondent counsel tertiary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/999-15&info=case-information-tab-parties-repondent',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
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
    actions: ['wait for #practitioner-representing to be visible'],
    notes: 'checks a11y of edit petitioner counsel page',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19/edit-petitioner-counsel/PT1234',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #respondent-counsel to be visible',
      'click element #respondent-counsel',
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
    actions: ['wait for #submit-edit-respondent-information to be visible'],
    notes: 'checks a11y of edit respondentCounsel page',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19/edit-respondent-counsel/RT6789',
  },
  {
    actions: [
      'wait for #tab-drafts to be visible',
      'click element #tab-drafts',
      'wait for #edit-order-button to be visible',
      'click element #edit-order-button',
      'wait for .modal-button-confirm to be visible',
    ],
    notes: 'checks the confirm modal when editing a signed draft document',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=edit-signed-order-confirm-modal/',
  },
  {
    actions: [
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-add-new-message to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-add-new-message',
      'wait for .ustc-create-message-modal to be visible',
    ],
    notes: 'checks a11y of create message modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-19&info=create-message-modal',
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
      'wait for #tab-tracked-items to be visible',
      'click element #tab-tracked-items',
    ],
    notes: 'checks a11y of deadlines tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/107-19&info=tracked-items-tab',
  },
  {
    actions: [
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-add-deadline to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-add-deadline',
      'wait for #deadline-date-date to be visible',
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
      'wait for #tab-drafts to be visible',
      'click element #tab-drafts',
    ],
    notes: 'checks a11y of the draft documents tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=drafts-tab',
  },
  {
    actions: [
      'wait for #tab-case-messages to be visible',
      'click element #tab-case-messages',
    ],
    notes: 'checks a11y of case messages tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=case-messages-tab',
  },
  {
    actions: [
      'wait for #tab-tracked-items to be visible',
      'click element #tab-tracked-items',
      'wait for #tab-pending-report to be visible',
      'click element #tab-pending-report',
    ],
    notes: 'checks a11y of tracked-items tab, pending report secondary tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/109-19&info=tracked-items-tab-pending-report',
  },
  {
    actions: [
      'wait for #tab-correspondence to be visible',
      'click element #tab-correspondence',
      'wait for .document-viewer--documents to be visible',
    ],
    notes: 'checks a11y of correspondence tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19&info=correspondence-tab',
  },
  {
    actions: ['wait for element #upload-correspondence to be visible'],
    notes: 'checks a11y of add correspondence page',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19/upload-correspondence&info=add-correspondence',
  },
  {
    actions: [
      'wait for #tab-correspondence to be visible',
      'click element #tab-correspondence',
      'wait for .document-viewer--documents to be visible',
      'click element .edit-correspondence-button',
      'wait for element #edit-correspondence-header to be visible',
    ],
    notes: 'checks a11y of edit correspondence page',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-19&info=edit-correspondence',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/103-20/document-view?docketEntryId=ac62f25a-49f9-46a5-aed7-d6b955a2dc34&info=document-view-review-and-serve-petition-button',
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #edit-case-trial-information-btn to be visible',
      'click element #edit-case-trial-information-btn',
      'wait for #add-edit-calendar-note to be visible',
      'click element #add-edit-calendar-note',
      'wait for .add-edit-calendar-note-modal to be visible',
    ],
    notes: 'checks the add edit calendar note modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/108-19&info=add-edit-calendar-note-modal',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #edit-case-trial-information-btn to be visible',
      'click element #edit-case-trial-information-btn',
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
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-statistics to be visible',
      'click element #tab-statistics',
      'wait for #tabContent-statistics to be visible',
    ],
    notes: 'checks the case detail => case information => statistics tab',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-20&info=statistics',
  },
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/add-other-statistics',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-20/add-deficiency-statistics',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/edit-other-statistics',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed',
  {
    actions: [
      'wait for button.red-warning to be visible',
      'click element button.red-warning',
      'wait for #modal-root to be visible',
    ],
    notes: 'checks the delete deficiency modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed&info=delete-deficiency-modal',
  },
  {
    actions: [
      'wait for button.red-warning to be visible',
      'click element button.red-warning',
      'wait for #modal-root to be visible',
    ],
    notes: 'checks the delete modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/101-19/edit-other-statistics&info=delete-other-statistics-modal',
  },
  {
    actions: [
      'wait for element #tab-parties to be visible',
      'click element #tab-parties',
      'wait for element .sealed-address to be visible',
    ],
    notes:
      'checks a11y of sealed address display for primary and secondary contact',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/case-information&info=sealed-address-display',
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
      'wait for #date-of-notice-date to be visible',
    ],
    notes: 'checks a11y of editable fields exposed when Yes notice attached',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/102-19/petition-qc?tab=irsNotice&info=reveal-notice-options',
  },
  {
    actions: [
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-date to be visible',
      'set field #case-type to Deficiency',
      'check field #case-type',
      'wait for .statistic-form to be visible',
    ],
    notes: 'checks the statistics section of the petition QC screen',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/file-a-petition/step-1&info=statistics-petition-qc',
  },
  {
    actions: [
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-date to be visible',
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
  {
    actions: [
      'wait for .remove-pdf-button to be visible',
      'click element .remove-pdf-button',
      'wait for .confirm-replace-petition-modal to be visible',
    ],
    notes: 'checks a11y of ConfirmReplacePetitionModal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/121-20/petition-qc',
  },

  /* review petition */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b/review',

  /* trial sessions */
  {
    actions: ['wait for #trial-sessions-tabs to be visible'],
    notes: 'checks a11y of trial sessions table list',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/trial-sessions&info=list-trial-sessions',
  },
  {
    actions: [
      'wait for #start-date-date to be visible',
      'wait for #meeting-id to be visible',
    ],
    notes: 'checks a11y of remote trial session add form',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/add-a-trial-session&info=add-trial-session',
  },
  {
    actions: [
      'wait for #start-date-date to be visible',
      'click element #inPerson-proceeding-label',
      'wait for #address1 to be visible',
    ],
    notes: 'checks a11y of in-person trial sessions add form',
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
  /* messages */
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/my/inbox&info=messages-inbox',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/my/outbox&info=messages-outbox',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/section/inbox&info=messages-section-inbox',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/section/outbox&info=messages-section-outbox',
  'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105&info=case-message-detail',
  {
    actions: [
      'wait for #button-forward to be visible',
      'click element #button-forward',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the forward modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105&info=message-detail-forward',
  },
  {
    actions: [
      'wait for #button-reply to be visible',
      'click element #button-reply',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the reply modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105&info=message-detail-reply',
  },
  {
    actions: [
      'wait for #button-complete to be visible',
      'click element #button-reply',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the complete modal',
    url:
      'http://localhost:1234/mock-login?token=petitionsclerk&path=/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105&info=message-detail-complete',
  },
];
