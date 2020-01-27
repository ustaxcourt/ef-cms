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
      .allow(null),
    description: joi.string().required(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .allow(null)
      .optional(),
    editState: joi
      .string()
      .allow(null)
      .optional(),
    eventCode: joi.string().required(),
    filedBy: joi
      .string()
      .optional()
      .allow(null),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required(),
    index: joi
      .number()
      .integer()
      .required(),
  }),
  undefined,
  DocketRecord.VALIDATION_ERROR_MESSAGES,
);

module.exports = { DocketRecord };
