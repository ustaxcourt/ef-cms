module.exports = [
  'http://localhost:1234/mock-login?token=docketclerk&path=/',
  {
    actions: [
      'wait for td.message-select-control>label to be visible',
      'click element td.message-select-control>label',
      'wait for .action-section to be visible',
    ],
    notes: 'checks a11y of section queue tab panel',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/document-qc/section/inbox&info=section-queue-tab',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19',
  {
    actions: [
      'wait for element .usa-radio__label[for=payment-status-paid] to be visible',
      'click element .usa-radio__label[for=payment-status-paid]',
      'wait for element #petition-payment-method to be visible',
    ],
    notes:
      'checks a11y of form when petition fee payment status paid is selected',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=paid',
  },
  {
    actions: [
      'wait for element .usa-radio__label[for=payment-status-unpaid] to be visible',
      'click element .usa-radio__label[for=payment-status-unpaid]',
      'wait for element #petition-payment-method to be removed',
    ],
    notes:
      'checks a11y of form when petition fee payment status unpaid is selected',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=unpaid',
  },
  {
    actions: [
      'wait for element .usa-radio__label[for=payment-status-waived] to be visible',
      'click element .usa-radio__label[for=payment-status-waived]',
      'wait for element #payment-date-waived-date to be visible',
    ],
    notes:
      'checks a11y of form when petition fee payment status waived is selected',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=waived',
  },
  {
    actions: [
      'wait for #has-other-filing-party to be visible',
      'click element label#has-other-filing-party-label',
      'wait for input#other-filing-party to be visible',
    ],
    notes: 'checks a11y of edit docket entry add other filing party',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/dc2664a1-f552-418f-bcc7-8a67f4246568/edit',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/add-paper-filing',
  'http://localhost:1234/mock-login?token=docketclerk&path=/reports/pending-report',
  {
    actions: [
      'wait for element .case-inventory-report-modal to be visible',
      'wait for #select-case-inventory-status to be visible',
      'set field #select-case-inventory-status to New',
      'check field #select-case-inventory-status',
      'wait for #select-case-inventory-judge to be visible',
      'set field #select-case-inventory-judge to Chief Judge',
      'check field #select-case-inventory-judge',
      'click element .modal-button-confirm',
      'wait for element table.case-inventory to be visible',
    ],
    notes: 'checks a11y of case inventory report builder',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/reports/case-inventory-report',
  },
  {
    actions: [
      'wait for element #certificate-of-service to be visible',
      'click element #certificate-of-service+label',
      'wait for element #service-date-date to be visible',
    ],
    notes: 'reveal all secondary drop-downs and inputs ',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/add-paper-filing&info=show-cos-inputs',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #tab-case-information',
      'wait for #menu-edit-case-context-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-edit-case-context-button',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks a11y of case context edit dialog',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/102-19&info=case-context-edit',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #participants-and-counsel to be visible',
      'click element #participants-and-counsel',
      'wait for .edit-participant to be visible',
      'click element .edit-participant',
    ],
    notes:
      'checks a11y of case information tab, parties secondary tab, participants and counsel tertiary tab',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/999-15&info=case-information-tab-parties-participants-and-counsel',
  },
  {
    actions: [
      'wait for #tab-case-information to be visible',
      'click element #tab-case-information',
      'wait for #tab-parties to be visible',
      'click element #tab-parties',
      'wait for #petitioners-and-counsel to be visible',
      'click element #petitioners-and-counsel',
      'wait for .edit-petitioner-button to be visible',
      'click element .edit-petitioner-button',
    ],
    notes:
      'checks a11y of case information tab, parties secondary tab, parties and counsel tertiary tab',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/999-15&info=case-information-tab-parties-petitioner-and-counsel',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/110-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
  {
    actions: [
      'wait for #judge to be visible',
      'set field #judge to Colvin',
      'check field #judge',
      'set field #free-text to Anything',
      'wait for #serve-to-parties-btn to be visible',
      'click element #serve-to-parties-btn',
      'wait for .confirm-initiate-service-modal to be visible',
    ],
    notes: 'checks a11y of confirm-initiate-service-modal dialog',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry&info=initiate-service-modal',
  },
  // Temporarily disabled for story 7387
  // {
  //   actions: [
  //     'wait for #tab-order to be visible',
  //     'click element #tab-order',
  //     'wait for #order-search to be visible',
  //     'set field #order-search to dismissal',
  //     'set field #startDate-date-start to 08/03/2001',
  //     'check field #startDate-date-start',
  //     'click element button#advanced-search-button',
  //     'wait for table.search-results to be visible',
  //   ],
  //   notes: 'checks a11y of advanced order search',
  //   url:
  //     'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=order-search-result',
  // },
  // {
  //   actions: [
  //     'wait for #tab-opinion to be visible',
  //     'click element #tab-opinion',
  //     'wait for #opinion-search to be visible',
  //     'set field #opinion-search to opinion',
  //     'set field #startDate-date-start to 08/03/2001',
  //     'check field #startDate-date-start',
  //     'click element button#advanced-search-button',
  //     'wait for table.search-results to be visible',
  //   ],
  //   notes: 'checks a11y of advanced opinion search',
  //   url:
  //     'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=opinion-search-result',
  // },
  // {
  //   actions: [
  //     'wait for #tab-order to be visible',
  //     'click element #tab-order',
  //     'wait for #order-search to be visible',
  //     'set field #order-search to meow',
  //     'set field #startDate-date-start to 08/03/2001',
  //     'check field #startDate-date-start',
  //     'click element button#advanced-search-button',
  //     'wait for svg.iconSealed to be visible',
  //   ],
  //   notes: 'checks a11y of advanced order search of a sealed case',
  //   url:
  //     'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=sealed-case-order-search-result',
  // },
  // {
  //   actions: [
  //     'wait for #tab-order to be visible',
  //     'click element #tab-opinion',
  //     'wait for #opinion-search to be visible',
  //     'set field #opinion-search to sunglasses',
  //     'set field #startDate-date-start to 08/03/2001',
  //     'check field #startDate-date-start',
  //     'click element button#advanced-search-button',
  //     'wait for table.search-results to be visible',
  //   ],
  //   notes: 'checks a11y of opinion search',
  //   url:
  //     'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=opinion-search-result-sunglasses',
  // },
  'http://localhost:1234/mock-login?token=docketclerk&path=/print-preview/110-19/',
  {
    actions: [
      'wait for #deadlineStart-date-start to be visible',
      'set field #deadlineStart-date-start to 01/01/2019',
      'check field #deadlineStart-date-start',
      'set field #deadlineEnd-date-end to 12/01/2019',
      'check field #deadlineEnd-date-end',
      'click element button#update-date-range-deadlines-button',
      'wait for table.deadlines to be visible',
    ],
    notes: 'checks a11y of case deadline report',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/reports/case-deadlines',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-20/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416',
  {
    actions: [
      'wait for #remove-petitioner-btn to be visible',
      'click element #remove-petitioner-btn',
      'wait for #remove-petitioner-modal to be visible',
    ],
    notes: 'checks a11y of remove petitioner confirm modal',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-20/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416&info=remove-petitioner-modal',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/102-19?openModal=PaperServiceConfirmModal',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/111-19?openModal=UnconsolidateCasesModal',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/104-20/upload-court-issued',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/104-20/edit-upload-court-issued/b1aa4aa2-c214-424c-8870-d0049c5744d8',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-20/document-view?docketEntryId=af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/document-view?docketEntryId=f1aa4aa2-c214-424c-8870-d0049c5744d7&info=document-view-serve-button',
  'http://localhost:1234/mock-login?token=docketclerk&path=/messages/104-19/message-detail/2d1191d3-4597-454a-a2b2-84e267ccf01e',
  {
    actions: [
      'wait for #use-same-address-above-label to be visible',
      'click element #use-same-address-above-label',
    ],
    notes: 'checks the add petitioner to case page',
    url: 'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-20/add-petitioner-to-case',
  },
];
