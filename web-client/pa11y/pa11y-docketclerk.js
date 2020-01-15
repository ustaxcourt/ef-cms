module.exports = [
  'http://localhost:1234/mock-login?token=docketclerk&path=/',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/documents/f1aa4aa2-c214-424c-8870-d0049c5744d7/sign',
  {
    actions: [
      'wait for #section-work-queue to be visible',
      'wait for #label-337f4e0d-cf5e-4c4f-b373-5256edbbbdf2 to be visible',
      'click element #label-337f4e0d-cf5e-4c4f-b373-5256edbbbdf2',
      'wait for .action-section to be visible',
    ],
    notes:
      'checks a11y of section queue tab panel, may become brittle if element IDs change',
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
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-19/edit-details&info=paid',
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
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-19/edit-details&info=unpaid',
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
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-19/edit-details&info=waived',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/documents/1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
  {
    actions: [
      'wait for #tab-pending-messages to be visible',
      'click element #tab-pending-messages',
      "wait for .send-to[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2'] to be visible",
      "click element .send-to[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2']",
      "wait for form.forward-form[data-workitemid='337f4e0d-cf5e-4c4f-b373-5256edbbbdf2'] to be visible",
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
      'wait for #serve-to-parties-btn to be visible',
      'click element #serve-to-parties-btn',
      'wait for .confirm-initiate-service-modal to be visible',
    ],
    notes: 'checks a11y of confirm-initiate-service-modal dialog',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/101-19/documents/25100ec6-eeeb-4e88-872f-c99fad1fe6c7/add-court-issued-docket-entry',
  },
  'http://localhost:1234/mock-login?token=docketclerk&path=/print-preview/110-19/',
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/105-19/edit-petitioner-information',
  {
    actions: [
      'wait for [name="contactPrimary.address1"] to be visible',
      'set [name="contactPrimary.address1"] to 123 Main St',
      'click element #submit-edit-petitioner-information',
      'wait for .paper-service-confirm-modal to be visible',
    ],
    notes: 'checks a11y of paper-service-confirm-modal dialog',
    url:
      'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/102-19/edit-petitioner-information?info=paper-service-modal',
  },
];
