const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

OpinionSearch.ORDER_SEARCH_PAGE_LOAD_SIZE = 6;

OpinionSearch.validationName = 'OpinionSearch';

/**
 * Order Search entity
 *
 * @param {object} rawProps the raw order search data
 * @constructor
 */
function OpinionSearch(rawProps = {}) {
  this.opinionKeyword = rawProps.opinionKeyword;
}

OpinionSearch.VALIDATION_ERROR_MESSAGES = {
  opinionKeyword: 'Enter a keyword or phrase',
};

OpinionSearch.schema = joi.object().keys({
  opinionKeyword: joi
    .string()
    .required()
    .description('The only required field to filter the search by'),
});

joiValidationDecorator(
  OpinionSearch,
  OpinionSearch.schema,
  OpinionSearch.VALIDATION_ERROR_MESSAGES,
);

module.exports = { OpinionSearch };
