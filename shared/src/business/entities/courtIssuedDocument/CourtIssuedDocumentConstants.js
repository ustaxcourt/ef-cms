const deepFreeze = require('deep-freeze');

/**
 * these are in a separate file from the entity so they can be used
 * in each of the sub-types without a circular dependency
 */
const VALIDATION_ERROR_MESSAGES = {
  attachments: 'Enter selection for Attachments',
  date: [
    {
      contains: 'must be greater than or equal to',
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

const ENTERED_AND_SERVED_EVENT_CODES = [
  'ODJ',
  'OD',
  'ODD',
  'OAD',
  'DEC',
  'SDEC',
];

const GENERIC_ORDER_DOCUMENT_TYPE = 'Order';

const SERVICE_STAMP_OPTIONS = ['Served', 'Entered and Served'];

module.exports = deepFreeze({
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
  VALIDATION_ERROR_MESSAGES,
});
