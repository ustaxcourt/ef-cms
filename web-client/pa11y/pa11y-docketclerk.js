module.exports = [
  'http://localhost:1234/mock-login?token=docketclerk&path=/',
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
  'http://localhost:1234/mock-login?token=docketclerk&path=/case-detail/103-19/add-docket-entry',
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
];
