/* eslint-disable max-lines */
const { loginAs } = require('./helpers');

module.exports = [
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/',
    ],
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
    ],
    url: 'http://localhost:1234/',
  },
  /* start case internal */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #party-type to be visible',
      'set field #party-type to Surviving spouse',
      'check field #party-type',
      'wait for #secondary-name to be visible',
    ],
    notes:
      'checks a11y of Create Case with inputs revealed - secondary contact',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #party-type to be visible',
      'set field #party-type to Corporation',
      'check field #party-type',
      'wait for #order-for-cds-label to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - Order for CDS',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #tab-case-info to be visible',
      'click element #tab-case-info',
      'wait for #date-received-picker to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - Case Info tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-picker to be visible',
    ],
    notes: 'checks a11y of Create Case with inputs revealed - IRS Notice tab',
    url: 'http://localhost:1234/',
  },

  /* case detail */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/108-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
    ],
    notes: 'checks a11y of case information tab, overview secondary tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
    ],
    notes: 'checks a11y of case information tab, petitioner secondary tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/999-15',
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
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19',
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
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-19/edit-petitioner-counsel/PT1234',
      'wait for #practitioner-representing to be visible',
    ],
    notes: 'checks a11y of edit petitioner counsel page',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19',
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
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19/edit-respondent-counsel/RT6789',
      'wait for #submit-edit-respondent-information to be visible',
    ],
    notes: 'checks a11y of edit respondentCounsel page',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/109-19',
      'wait for #tab-drafts to be visible',
      'click element #tab-drafts',
      'wait for #edit-order-button to be visible',
      'click element #edit-order-button',
      'wait for .modal-button-confirm to be visible',
    ],
    notes: 'checks the confirm modal when editing a signed draft document',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-19',
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-add-new-message to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-add-new-message',
      'wait for .ustc-create-message-modal to be visible',
    ],
    notes: 'checks a11y of create message modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-19',
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-create-order to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-create-order',
      'wait for #eventCode to be visible',
    ],
    notes: 'checks a11y of create order select document type modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/107-19',
      'wait for #tab-tracked-items to be visible',
      'click element #tab-tracked-items',
    ],
    notes: 'checks a11y of deadlines tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-19',
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-button-add-deadline to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-button-add-deadline',
      'wait for #deadline-date-picker to be visible',
    ],
    notes: 'checks a11y of add deadline modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/109-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #blocked-from-trial-header to be visible',
    ],
    notes:
      'checks a11y of case information overview tab for a case with a manual and automatic block',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/109-19',
      'wait for #tab-drafts to be visible',
      'click element #tab-drafts',
    ],
    notes: 'checks a11y of the draft documents tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/109-19',
      'wait for #tab-case-messages to be visible',
      'click element #tab-case-messages',
    ],
    notes: 'checks a11y of case messages tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/109-19',
      'wait for #tab-tracked-items to be visible',
      'click element #tab-tracked-items',
      'wait for #tab-pending-report to be visible',
      'click element #tab-pending-report',
    ],
    notes: 'checks a11y of tracked-items tab, pending report secondary tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19',
      'wait for #tab-correspondence to be visible',
      'click element #tab-correspondence',
      'wait for .document-viewer--documents to be visible',
    ],
    notes: 'checks a11y of correspondence tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19/upload-correspondence',
      'wait for element #upload-correspondence to be visible',
    ],
    notes: 'checks a11y of add correspondence page',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/103-19',
      'wait for #tab-correspondence to be visible',
      'click element #tab-correspondence',
      'wait for .document-viewer--documents to be visible',
      'click element .edit-correspondence-button',
      'wait for element #edit-correspondence-header to be visible',
    ],
    notes: 'checks a11y of edit correspondence page',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/case-detail/103-20/document-view?docketEntryId=ac62f25a-49f9-46a5-aed7-d6b955a2dc34',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/108-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #edit-case-trial-information-btn to be visible',
      'click element #edit-case-trial-information-btn',
      'wait for #add-edit-calendar-note to be visible',
      'click element #add-edit-calendar-note',
      'wait for .add-edit-calendar-note-modal to be visible',
    ],
    notes: 'checks the add edit calendar note modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/108-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #edit-case-trial-information-btn to be visible',
      'click element #edit-case-trial-information-btn',
      'wait for #remove-from-trial-session-btn to be visible',
      'click element #remove-from-trial-session-btn',
      'wait for #remove-from-trial-session-modal to be visible',
    ],
    notes: 'checks the remove from trial session modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for .high-priority-btn to be visible',
      'click element .high-priority-btn',
      'wait for #prioritize-case-modal to be visible',
    ],
    notes: 'opens the prioritize case modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/110-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #remove-high-priority-btn to be visible',
      'click element #remove-high-priority-btn',
      'wait for #unprioritize-modal to be visible',
    ],
    notes: 'opens the unprioritize case modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-19',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #add-to-trial-session-btn to be visible',
      'click element #add-to-trial-session-btn',
      'wait for #add-to-trial-session-modal to be visible',
    ],
    notes: 'checks the add to trial session modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20',
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-statistics to be visible',
      'click element #tab-statistics',
      'wait for #tabContent-statistics to be visible',
    ],
    notes: 'checks the case detail => case information => statistics tab',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/add-other-statistics',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20/add-deficiency-statistics',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/edit-other-statistics',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/105-20/edit-deficiency-statistic/cb557361-50ee-4440-aaff-0a9f1bfa30ed',
      'wait for button.red-warning to be visible',
      'click element button.red-warning',
      'wait for #modal-root to be visible',
    ],
    notes: 'checks the delete deficiency modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/101-19/edit-other-statistics',
      'wait for button.red-warning to be visible',
      'click element button.red-warning',
      'wait for #modal-root to be visible',
    ],
    notes: 'checks the delete modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19/case-information',
      'wait for element #tab-parties to be visible',
      'click element #tab-parties',
      'wait for element .sealed-address to be visible',
    ],
    notes:
      'checks a11y of sealed address display for primary and secondary contact',
    url: 'http://localhost:1234/',
  },

  /* petition qc */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-19/petition-qc?tab=partyInfo',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-19/petition-qc?tab=caseInfo',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/102-19/petition-qc?tab=irsNotice',
      'wait for button#tab-irs-notice to be visible',
      'click element button#tab-irs-notice',
      'wait for label#has-irs-verified-notice-yes to be visible',
      'click element label#has-irs-verified-notice-yes',
      'wait for #date-of-notice-picker to be visible',
    ],
    notes: 'checks a11y of editable fields exposed when Yes notice attached',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-picker to be visible',
      'set field #case-type to Deficiency',
      'check field #case-type',
      'wait for .statistic-form to be visible',
    ],
    notes: 'checks the statistics section of the petition QC screen',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/file-a-petition/step-1',
      'wait for #tab-irs-notice to be visible',
      'click element #tab-irs-notice',
      'wait for #irs-verified-notice-radios to be visible',
      'click element #has-irs-verified-notice-yes',
      'wait for #date-of-notice-picker to be visible',
      'set field #case-type to Deficiency',
      'check field #case-type',
      'wait for .calculate-penalties to be visible',
      'click element .calculate-penalties',
      'wait for .modal-screen to be visible',
    ],
    notes: 'checks the Calculate Penalties on IRS Notice modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/121-20/petition-qc',
      'wait for .remove-pdf-button to be visible',
      'click element .remove-pdf-button',
      'wait for .confirm-replace-petition-modal to be visible',
    ],
    notes: 'checks a11y of ConfirmReplacePetitionModal',
    url: 'http://localhost:1234/',
  },

  /* review petition */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/case-detail/104-19/documents/c63be3f2-2240-451e-b6bd-8206d52a070b/review',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },

  /* trial sessions */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/trial-sessions',
      'wait for #trial-sessions-tabs to be visible',
    ],
    notes: 'checks a11y of trial sessions table list',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/add-a-trial-session',
      'wait for #start-date-picker to be visible',
      'wait for #meeting-id to be visible',
    ],
    notes: 'checks a11y of remote trial session add form',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/add-a-trial-session',
      'wait for #standaloneRemote-session-scope-label to be visible',
      'click element #standaloneRemote-session-scope-label',
    ],
    notes: 'checks a11y of standalone remote trial session add form',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/add-a-trial-session',
      'wait for #start-date-picker to be visible',
      'click element #inPerson-proceeding-label',
      'wait for #address1 to be visible',
    ],
    notes: 'checks a11y of in-person trial sessions add form',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/reports/blocked-cases',
      'wait for #trial-location to be visible',
      'set field #trial-location to Birmingham, Alabama',
      'check field #trial-location',
    ],
    notes: 'checks the blocked cases screen',
    url: 'http://localhost:1234/',
  },
  // this url probably needs to be moved to calendaring when those users are created
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/reports/case-deadlines',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #reports-btn to be visible',
      'click element #reports-btn',
      'wait for #trial-session-planning-btn to be visible',
      'click element #trial-session-planning-btn',
      'wait for .trial-session-planning-modal to be visible',
    ],
    notes: 'checks the trial session planning modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/edit-trial-session/6b6975cf-2b10-4e84-bcae-91e162d2f9d1',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/search',
      'wait for #tab-practitioner to be visible',
      'click element #tab-practitioner',
      'wait for #practitioner-name to be visible',
      'set field #practitioner-name to test',
      'click element #practitioner-search-by-name-button',
      'wait for .search-results to be visible',
    ],
    notes: 'checks the advanced search practitioner tab and results table',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/practitioner-detail/PT1234',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  /* messages */
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/my/inbox',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/my/outbox',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/section/inbox',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/section/outbox',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
    ],
    notes: '',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
      'wait for #button-forward to be visible',
      'click element #button-forward',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the forward modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
      'wait for #button-reply to be visible',
      'click element #button-reply',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the reply modal',
    url: 'http://localhost:1234/',
  },
  {
    actions: [
      ...loginAs({ username: 'petitionsclerk@example.com' }),
      'navigate to http://localhost:1234/messages/105-20/message-detail/eb0a139a-8951-4de1-8b83-f02a27504105',
      'wait for #button-complete to be visible',
      'click element #button-reply',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks the complete modal',
    url: 'http://localhost:1234/',
  },
];
