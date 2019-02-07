const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

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
  }),
  () => true,
  {},
);

module.exports = DocketRecord;
