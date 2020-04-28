const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getAllEventCodes } = require('../../utilities/getAllEventCodes');
const { getTimestampSchema } = require('../../utilities/dateSchema');

const joiStrictTimestamp = getTimestampSchema();
/**
 * DocketRecord constructor
 *
 * @param {object} rawDocketRecord the raw docket record data
 * @constructor
 */
function DocketRecord(rawDocketRecord, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.docketRecordId =
    rawDocketRecord.docketRecordId || applicationContext.getUniqueId();
  this.action = rawDocketRecord.action;
  this.description = rawDocketRecord.description;
  this.documentId = rawDocketRecord.documentId;
  this.editState = rawDocketRecord.editState;
  this.eventCode = rawDocketRecord.eventCode;
  this.filedBy = rawDocketRecord.filedBy;
  this.filingDate = rawDocketRecord.filingDate;
  this.index = rawDocketRecord.index;
  this.servedPartiesCode = rawDocketRecord.servedPartiesCode;
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
      .meta({ tags: ['Restricted'] })
      .description('JSON representation of the in-progress edit of this item.'),
    eventCode: joi
      .string()
      .valid(...getAllEventCodes())
      .required()
      .description(
        'Code associated with the event that resulted in this item being added to the Docket Record.',
      ),
    filedBy: joi
      .string()
      .optional()
      .allow(null)
      .meta({ tags: ['Restricted'] })
      .description('ID of the user that filed this Docket Record item.'),
    filingDate: joiStrictTimestamp
      .max('now')
      .required()
      .description('Date that this Docket Record item was filed.'),
    index: joi
      .number()
      .integer()
      .required()
      .description('Index of this item in the Docket Record list.'),
    servedPartiesCode: joi
      .string()
      .allow(null)
      .optional()
      .description('Served parties code to override system-computed code.'),
  }),
  undefined,
  DocketRecord.VALIDATION_ERROR_MESSAGES,
);

module.exports = { DocketRecord };
