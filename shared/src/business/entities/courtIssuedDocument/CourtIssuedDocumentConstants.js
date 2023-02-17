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
  docketNumbers: [
    { contains: 'is required', message: 'Enter docket number(s)' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 500 characters. Enter 500 or fewer characters.',
    },
  ],
  documentType: 'Select a document type',
  filingDate: 'Enter a filing date',
  freeText: [
    { contains: 'is required', message: 'Enter a description' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    },
  ],
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
const REPORT_PAMPHLET_DOCUMENT_TYPE = 'Tax Court Report Pamphlet';

const DOCUMENT_TYPES_REQUIRING_DESCRIPTION = [
  GENERIC_ORDER_DOCUMENT_TYPE,
  REPORT_PAMPHLET_DOCUMENT_TYPE,
];

const SERVICE_STAMP_OPTIONS = ['Served', 'Entered and Served'];

module.exports = deepFreeze({
  DOCUMENT_TYPES_REQUIRING_DESCRIPTION,
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
  REPORT_PAMPHLET_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
  VALIDATION_ERROR_MESSAGES,
});
