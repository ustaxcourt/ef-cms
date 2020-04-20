const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

OrderSearch.ORDER_SEARCH_PAGE_LOAD_SIZE = 6;
OrderSearch.VALID_DATE_SEARCH_FORMATS = [
  'YYYY/MM/DD',
  'YYYY/MM/D',
  'YYYY/M/DD',
  'YYYY/M/D',
];

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
  this.startDate = OrderSearch.dateFormat(
    rawProps.startDateYear,
    rawProps.startDateMonth,
    rawProps.startDateDay,
  );
  this.endDate = OrderSearch.dateFormat(
    rawProps.endDateYear,
    rawProps.endDateMonth,
    rawProps.endDateDay,
  );
  this.caseTitleOrPetitioner = rawProps.caseTitleOrPetitioner;
}

OrderSearch.VALIDATION_ERROR_MESSAGES = {
  chooseOneValue:
    'Enter either a Docket number or a Case name/Petitioner name, not both',
  endDate: 'Enter a valid end date',
  orderKeyword: 'Enter a keyword or phrase',
  startDate: 'Enter a valid start date',
};

OrderSearch.dateFormat = (year, month, day) => {
  if (year || month || day) {
    return `${year}/${month}/${day}`;
  }
};

OrderSearch.schema = joi
  .object()
  .keys({
    caseTitleOrPetitioner: joi.string().empty(''),
    docketNumber: joi.string().empty(''),
    endDate: joi.alternatives().conditional('startDate', {
      is: joi.exist().not(null),
      otherwise: joi
        .date()
        .format(OrderSearch.VALID_DATE_SEARCH_FORMATS)
        .optional(),
      then: joi
        .date()
        .format(OrderSearch.VALID_DATE_SEARCH_FORMATS)
        .min(joi.ref('startDate'))
        .optional(),
    }),
    orderKeyword: joi.string().required(),
    startDate: joi.alternatives().conditional('endDate', {
      is: joi.exist().not(null),
      otherwise: joi
        .date()
        .format(OrderSearch.VALID_DATE_SEARCH_FORMATS)
        .max('now')
        .optional(),
      then: joi
        .date()
        .format(OrderSearch.VALID_DATE_SEARCH_FORMATS)
        .max('now')
        .required(),
    }),
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
