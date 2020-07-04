module.exports = [
  'http://localhost:1234/mock-login?token=docketclerk&path=/',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/f1aa4aa2-c214-424c-8870-d0049c5744d7/sign',
  {
    actions: [
      'wait for td.message-select-control>label to be visible',
      'click element td.message-select-control>label',
      'wait for .action-section to be visible',
    ],
    notes: 'checks a11y of section queue tab panel',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/document-qc/section/inbox&info=section-queue-tab',
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
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=paid',
  },
  {
    actions: [
      'wait for element .usa-radio__label[for=payment-status-unpaid] to be visible',
      'click element .usa-radio__label[for=payment-status-unpaid]',
      'wait for element #petition-payment-method to be removed',
    ],
    notes:
      'checks a11y of form when petition fee payment status unpaid is selected',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=unpaid',
  },
  {
    actions: [
      'wait for element .usa-radio__label[for=payment-status-waived] to be visible',
      'click element .usa-radio__label[for=payment-status-waived]',
      'wait for element #payment-date-waived-legend to be visible',
    ],
    notes:
      'checks a11y of form when petition fee payment status waived is selected',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/edit-details&info=waived',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/documents/1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
  {
    actions: [
      'wait for #tab-pending-messages to be visible',
      'click element #tab-pending-messages',
      "wait for .send-to[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2'] to be visible",
      "click element .send-to[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2']",
      "wait for .forward-form[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2'] to be visible",
    ],
    notes: 'checks a11y of forward form',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/f1aa4aa2-c214-424c-8870-d0049c5744d7&info=forwarding-form',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/dc2664a1-f552-418f-bcc7-8a67f4246568/complete',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/dc2664a1-f552-418f-bcc7-8a67f4246568/edit',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/add-docket-entry',
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
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/reports/case-inventory-report',
  },
  {
    actions: [
      'wait for element #certificate-of-service to be visible',
      'click element #certificate-of-service+label',
      'wait for element #service-date-month to be visible',
    ],
    notes: 'reveal all secondary drop-downs and inputs ',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/add-docket-entry&info=show-cos-inputs',
  },
  {
    actions: [
      'wait for #case-detail-menu-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #case-detail-menu-button',
      'wait for #menu-edit-case-context-button to be visible',
      'wait for .progress-indicator to be hidden',
      'click element #menu-edit-case-context-button',
      'wait for .modal-dialog to be visible',
    ],
    notes: 'checks a11y of case context edit dialog',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/102-19&info=case-context-edit',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/110-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
  {
    actions: [
      'wait for #judge to be visible',
      'set field #judge to Judge Armen',
      'check field #judge',
      'set field #free-text to Anything',
      'wait for #serve-to-parties-btn to be visible',
      'click element #serve-to-parties-btn',
      'wait for .confirm-initiate-service-modal to be visible',
    ],
    notes: 'checks a11y of confirm-initiate-service-modal dialog',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry&info=initiate-service-modal',
  },
  {
    actions: [
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #order-search to be visible',
      'set field #order-search to dismissal',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced order search',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=order-search-result',
  },
  {
    actions: [
      'wait for #tab-opinion to be visible',
      'click element #tab-opinion',
      'wait for #opinion-search to be visible',
      'set field #opinion-search to opinion',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of advanced opinion search',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=opinion-search-result',
  },
  {
    actions: [
      'wait for #tab-order to be visible',
      'click element #tab-order',
      'wait for #order-search to be visible',
      'set field #order-search to meow',
      'click element button#advanced-search-button',
      'wait for svg.iconSealed to be visible',
    ],
    notes: 'checks a11y of advanced order search of a sealed case',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=sealed-case-order-search-result',
  },
  {
    actions: [
      'wait for #tab-order to be visible',
      'click element #tab-opinion',
      'wait for #opinion-search to be visible',
      'set field #opinion-search to sunglasses',
      'click element button#advanced-search-button',
      'wait for table.search-results to be visible',
    ],
    notes: 'checks a11y of opinion search',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/search&info=opinion-search-result',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/print-preview/110-19/',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-19/edit-petitioner-information',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/102-19?openModal=PaperServiceConfirmModal',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/111-19?openModal=UnconsolidateCasesModal',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/104-20/upload-court-issued',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/104-20/edit-upload-court-issued/b1aa4aa2-c214-424c-8870-d0049c5744d8',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-20/document-view?documentId=af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
];
