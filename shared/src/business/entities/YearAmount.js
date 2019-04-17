const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param yearAmount
 * @constructor
 */
function YearAmount(yearAmount) {
  Object.assign(this, yearAmount);
}

joiValidationDecorator(
  YearAmount,
  joi.object().keys({
    amount: joi
      .number()
      .allow(null)
      .greater(0)
      .integer()
      .optional(),
    year: joi
      .date()
      .max('now')
      .iso()
      .required(),
  }),
  () => true,
  {
    amount: 'Please enter a valid amount.',
    year: [
      {
        contains: 'must be less than or equal to',
        message: 'That year is in the future. Please enter a valid year.',
      },
      'Please enter a valid year.',
    ],
  },
);

module.exports = { YearAmount };
