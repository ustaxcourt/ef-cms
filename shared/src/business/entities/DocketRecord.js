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
    description: joi
      .string()
      .optional()
      .allow(null),
    filedBy: joi
      .string()
      .optional()
      .allow(null),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required(),
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
