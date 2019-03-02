const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

/**
 *
 * @param docketRecord
 * @constructor
 */
function DocketRecord(docketRecord) {
  Object.assign(this, docketRecord);
}

joiValidationDecorator(
  DocketRecord,
  joi.object().keys({
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required(),
    description: joi
      .string()
      .optional()
      .allow(null),
    filedBy: joi
      .string()
      .optional()
      .allow(null),
    status: joi
      .string()
      .allow(null)
      .optional(),
    documentId: joi
      .string()
      .allow(null)
      .optional(),
  }),
  () => true,
  {},
);

module.exports = DocketRecord;
