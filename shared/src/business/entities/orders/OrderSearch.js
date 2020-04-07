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
}

OrderSearch.VALIDATION_ERROR_MESSAGES = {
  orderKeyword: 'Enter a keyword or phrase',
};

OrderSearch.schema = joi.object().keys({
  orderKeyword: joi.string().required(),
});

joiValidationDecorator(
  OrderSearch,
  OrderSearch.schema,
  undefined,
  OrderSearch.VALIDATION_ERROR_MESSAGES,
);

module.exports = { OrderSearch };
