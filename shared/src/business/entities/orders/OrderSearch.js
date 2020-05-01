const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const {
  createEndOfDayISO,
  createStartOfDayISO,
} = require('../../utilities/DateHandler');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { isEmpty } = require('lodash');

OrderSearch.ORDER_SEARCH_PAGE_LOAD_SIZE = 6;

OrderSearch.validationName = 'OrderSearch';

/**
 * Order Search entity
 *
 * @param {object} rawProps the raw order search data
 * @constructor
 */
function OrderSearch(rawProps = {}) {
  if (!isEmpty(rawProps.judge)) {
    this.judge = rawProps.judge;
  }

  this.orderKeyword = rawProps.orderKeyword;

  if (!isEmpty(rawProps.docketNumber)) {
    this.docketNumber = rawProps.docketNumber;
  }

  if (
    rawProps.startDateDay ||
    rawProps.startDateMonth ||
    rawProps.startDateYear
  ) {
    this.startDate = createStartOfDayISO({
      day: rawProps.startDateDay,
      month: rawProps.startDateMonth,
      year: rawProps.startDateYear,
    });
  }

  if (rawProps.endDateDay || rawProps.endDateMonth || rawProps.endDateYear) {
    this.endDate = createEndOfDayISO({
      day: rawProps.endDateDay,
      month: rawProps.endDateMonth,
      year: rawProps.endDateYear,
    });

    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  if (!isEmpty(rawProps.caseTitleOrPetitioner)) {
    this.caseTitleOrPetitioner = rawProps.caseTitleOrPetitioner;
  }
}

OrderSearch.VALIDATION_ERROR_MESSAGES = {
  chooseOneValue:
    'Enter either a Docket number or a Case name/Petitioner name, not both',
  endDate: 'Enter a valid end date',
  orderKeyword: 'Enter a keyword or phrase',
  startDate: 'Enter a valid start date',
};

OrderSearch.schema = joi
  .object()
  .keys({
    caseTitleOrPetitioner: joi.string(),
    docketNumber: joi.string(),
    endDate: joi.alternatives().conditional('startDate', {
      is: joi.exist().not(null),
      otherwise: joi.date().less(joi.ref('tomorrow')).optional(),
      then: joi
        .date()
        .min(joi.ref('startDate'))
        .less(joi.ref('tomorrow'))
        .optional(),
    }),
    judge: joi.string().optional(),
    orderKeyword: joi.string().required(),
    startDate: joi.alternatives().conditional('endDate', {
      is: joi.exist().not(null),
      otherwise: joi.date().max('now').optional(),
      then: joi.date().max('now').required(),
    }),
    tomorrow: joi.optional(),
  })
  .oxor('caseTitleOrPetitioner', 'docketNumber');

joiValidationDecorator(
  OrderSearch,
  OrderSearch.schema,
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
