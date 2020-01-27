const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * DocketRecord constructor
 *
 * @param {object} rawDocketRecord the raw docket record data
 * @constructor
 */
function DocketRecord(rawDocketRecord) {
  this.action = rawDocketRecord.action;
  this.description = rawDocketRecord.description;
  this.documentId = rawDocketRecord.documentId;
  this.editState = rawDocketRecord.editState;
  this.eventCode = rawDocketRecord.eventCode;
  this.filedBy = rawDocketRecord.filedBy;
  this.filingDate = rawDocketRecord.filingDate;
  this.index = rawDocketRecord.index;
}

DocketRecord.validationName = 'DocketRecord';

DocketRecord.VALIDATION_ERROR_MESSAGES = {
  description: 'Enter a description',
  eventCode: 'Enter an event code',
  filingDate: 'Enter a valid filing date',
  index: 'Enter an index',
};

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    action: joi
      .string()
      .optional()
      .allow(null)
      .description('Action taken in response to this Docket Record item.'),
    description: joi
      .string()
      .required()
      .description(
        'Text that describes this Docket Record item, which may be part of the Filings and Proceedings value.',
      ),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .allow(null)
      .optional()
      .description('ID of the associated PDF document in the S3 bucket.'),
    editState: joi
      .string()
      .allow(null)
      .optional()
      .description('JSON representation of the in-progress edit of this item.'),
    // TODO: Gather all event codes for validation
    eventCode: joi.string().required(),
    filedBy: joi
      .string()
      .optional()
      .allow(null)
      .description('ID of the uswer that filed this Docket Record item.'),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required()
      .description('Date that this Docket Record item was filed.'),
    index: joi
      .number()
      .integer()
      .required()
      .description('Index of this item in the Docket Record list.'),
  }),
  undefined,
  DocketRecord.VALIDATION_ERROR_MESSAGES,
);

module.exports = { DocketRecord };
