const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param docketRecord
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
}

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    description: joi
      .string()
      .optional()
      .allow(null),
    documentId: joi
      .string()
      .allow(null)
      .optional(),
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
      .optional(),
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
