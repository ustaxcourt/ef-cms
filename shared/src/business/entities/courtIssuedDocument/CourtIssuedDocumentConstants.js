/**
 * these are in a separate file from the entity so they can be used
 * in each of the sub-types without a circular dependency
 */
exports.VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments',
  date: [
    {
      contains: 'must be larger than or equal to',
      message: 'Enter a valid date',
    },
    {
      contains: 'must be less than or equal to',
      message: 'Enter a valid date',
    },
    'Enter a date',
  ],
  docketNumbers: 'Enter docket number(s)',
  documentType: 'Select a document type',
  freeText: 'Enter a description',
  judge: 'Select a judge',
  serviceStamp: 'Select a service stamp',
  trialLocation: 'Select a trial location',
};

exports.ENTERED_AND_SERVED_EVENT_CODES = [
  'ODJ',
  'OD',
  'ODD',
  'OAD',
  'DEC',
  'SDEC',
];

exports.GENERIC_ORDER_DOCUMENT_TYPE = 'Order';

exports.SERVICE_STAMP_OPTIONS = ['Served', 'Entered and Served'];
