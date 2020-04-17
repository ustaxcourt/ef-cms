const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

OrderSearch.ORDER_SEARCH_PAGE_LOAD_SIZE = 6;

OrderSearch.validationName = 'OrderSearch';

/**
 * Order Search entity
 *
 * @param {object} rawProps the raw order search data
 * @constructor
 */
function OrderSearch(rawProps = {}) {
  this.orderKeyword = rawProps.orderKeyword;
  this.docketNumber = rawProps.docketNumber;
  this.caseTitleOrPetitioner = rawProps.caseTitleOrPetitioner;
}

OrderSearch.VALIDATION_ERROR_MESSAGES = {
  chooseOneValue:
    'Enter either a Docket number or a Case name/Petitioner name, not both',
  orderKeyword: 'Enter a keyword or phrase',
};

OrderSearch.schema = joi
  .object()
  .keys({
    caseTitleOrPetitioner: joi.string().empty(''),
    docketNumber: joi.string().empty(''),
    orderKeyword: joi.string().required(),
  })
  .oxor('caseTitleOrPetitioner', 'docketNumber');

joiValidationDecorator(
  OrderSearch,
  OrderSearch.schema,
  undefined,
  OrderSearch.VALIDATION_ERROR_MESSAGES,
);

const originalGetValidationErrors = OrderSearch.prototype.getValidationErrors;

OrderSearch.prototype.getValidationErrors = function () {
  const validationErrors = originalGetValidationErrors.call(this);

  if (validationErrors && validationErrors['object.oxor']) {
    validationErrors['chooseOneValue'] = validationErrors['object.oxor'];
    delete validationErrors['object.oxor'];
  }

  return validationErrors;
};

module.exports = { OrderSearch };
