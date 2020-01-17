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
  this.description = rawDocketRecord.description;
  this.signatory = rawDocketRecord.signatory;
  this.documentId = rawDocketRecord.documentId;
  this.filedBy = rawDocketRecord.filedBy;
  this.filingDate = rawDocketRecord.filingDate;
  this.index = rawDocketRecord.index;
  this.status = rawDocketRecord.status;
  this.eventCode = rawDocketRecord.eventCode;
  this.editState = rawDocketRecord.editState;
}

DocketRecord.validationName = 'DocketRecord';

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    description: joi.string().required(),
    documentId: joi
      .string()
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
    signatory: joi
      .string()
      .optional()
      .allow(null),
    status: joi
      .string()
      .allow(null)
      .optional(),
  }),
  () => true,
  {},
);

module.exports = { DocketRecord };
