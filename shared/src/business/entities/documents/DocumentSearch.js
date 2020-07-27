const joi = require('joi');
const {
  createEndOfDayISO,
  createStartOfDayISO,
} = require('../../utilities/DateHandler');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { isEmpty } = require('lodash');

DocumentSearch.DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

DocumentSearch.validationName = 'DocumentSearch';

DocumentSearch.VALID_DATE_SEARCH_FORMATS = [
  'YYYY/MM/DD',
  'YYYY/MM/D',
  'YYYY/M/DD',
  'YYYY/M/D',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
];

/**
 * Document Search entity
 *
 * @param {object} rawProps the raw document search data
 * @constructor
 */
function DocumentSearch(rawProps = {}) {
  if (!isEmpty(rawProps.judge)) {
    this.judge = rawProps.judge;
  }

  if (!isEmpty(rawProps.opinionType)) {
    this.opinionType = rawProps.opinionType;
  }

  this.keyword = rawProps.keyword;

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

DocumentSearch.VALIDATION_ERROR_MESSAGES = {
  chooseOneValue:
    'Enter either a Docket number or a Case name/Petitioner name, not both',
  endDate: 'Enter a valid end date',
  keyword: 'Enter a keyword or phrase',
  startDate: 'Enter a valid start date',
};

DocumentSearch.schema = joi
  .object()
  .keys({
    caseTitleOrPetitioner: joi
      .string()
      .description(
        'The case title or petitioner name to filter the search results by',
      ),
    docketNumber: joi
      .string()
      .description('The docket number to filter the search results by'),
    endDate: joi.alternatives().conditional('startDate', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.format(
        DocumentSearch.VALID_DATE_SEARCH_FORMATS,
      )
        .less(joi.ref('tomorrow'))
        .optional()
        .description(
          'The end date search filter is not required if there is no start date',
        ),
      then: JoiValidationConstants.ISO_DATE.format(
        DocumentSearch.VALID_DATE_SEARCH_FORMATS,
      )
        .min(joi.ref('startDate'))
        .less(joi.ref('tomorrow'))
        .optional()
        .description(
          'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
        ),
    }),
    judge: joi
      .string()
      .optional()
      .description('The name of the judge to filter the search results by'),
    keyword: joi
      .string()
      .required()
      .description('The only required field to filter the search by'),
    opinionType: joi
      .string()
      .optional()
      .description('The opinion document type to filter the search results by'),
    startDate: joi.alternatives().conditional('endDate', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.format(
        DocumentSearch.VALID_DATE_SEARCH_FORMATS,
      )
        .max('now')
        .optional()
        .description(
          'The start date to search by, which cannot be greater than the current date, and is optional when there is no end date provided',
        ),
      then: JoiValidationConstants.ISO_DATE.format(
        DocumentSearch.VALID_DATE_SEARCH_FORMATS,
      )
        .max('now')
        .required()
        .description(
          'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
        ),
    }),
    tomorrow: joi
      .optional()
      .description(
        'The computed value to validate the endDate against, in order to verify that the endDate is less than or equal to the current date',
      ),
  })
  .oxor('caseTitleOrPetitioner', 'docketNumber');

joiValidationDecorator(
  DocumentSearch,
  DocumentSearch.schema,
  DocumentSearch.VALIDATION_ERROR_MESSAGES,
);

const originalGetValidationErrors =
  DocumentSearch.prototype.getValidationErrors;

DocumentSearch.prototype.getValidationErrors = function () {
  const validationErrors = originalGetValidationErrors.call(this);

  if (validationErrors && validationErrors['object.oxor']) {
    validationErrors['chooseOneValue'] = validationErrors['object.oxor'];
    delete validationErrors['object.oxor'];
  }

  return validationErrors;
};

module.exports = { DocumentSearch };
