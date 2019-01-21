const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function YearAmount(yearAmount) {
  Object.assign(this, yearAmount);
}

joiValidationDecorator(
  YearAmount,
  joi.object().keys({
    year: joi.string().required(),
    amount: joi.string().required(),
  }),
  () => true,
  {
    year: 'A valid year is required.',
    amount: 'A valid amount is required.',
  },
);

module.exports = YearAmount;
