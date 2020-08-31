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
  validEntityDecorator,
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
function DocumentSearch() {}

DocumentSearch.prototype.init = function init(rawProps = {}) {
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

  if (rawProps.startDate) {
    const [month, day, year] = rawProps.startDate.split('/');
    this.startDate = createStartOfDayISO({
      day,
      month,
      year,
    });
  }

  if (rawProps.endDate) {
    const [month, day, year] = rawProps.endDate.split('/');
    this.endDate = createEndOfDayISO({
      day,
      month,
      year,
    });
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  if (!isEmpty(rawProps.caseTitleOrPetitioner)) {
    this.caseTitleOrPetitioner = rawProps.caseTitleOrPetitioner;
  }
};

DocumentSearch.VALIDATION_ERROR_MESSAGES = {
  chooseOneValue:
    'Enter either a Docket number or a Case name/Petitioner name, not both',
  endDate: [
    {
      contains: 'must be less than',
      message: 'End date cannot be in the future. Enter valid end date.',
    },
    'Enter a valid end date',
  ],
  keyword: 'Enter a keyword or phrase',
  startDate: [
    {
      contains: 'must be less than or equal to "now"',
      message: 'Start date cannot be in the future. Enter valid start date.',
    },
    'Enter a valid start date',
  ],
};

DocumentSearch.schema = joi
  .object()
  .keys({
    caseTitleOrPetitioner: JoiValidationConstants.STRING.description(
      'The case title or petitioner name to filter the search results by',
    ),
    docketNumber: JoiValidationConstants.STRING.description(
      'The docket number to filter the search results by',
    ),
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
        .less(joi.ref('tomorrow'))
        .min(joi.ref('startDate'))
        .optional()
        .description(
          'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
        ),
    }),
    judge: JoiValidationConstants.STRING.optional().description(
      'The name of the judge to filter the search results by',
    ),
    keyword: JoiValidationConstants.STRING.required().description(
      'The only required field to filter the search by',
    ),
    opinionType: JoiValidationConstants.STRING.optional().description(
      'The opinion document type to filter the search results by',
    ),
    startDate: joi.alternatives().conditional('endDate', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.format(
        DocumentSearch.VALID_DATE_SEARCH_FORMATS,
      )
        .max('now')
        .description(
          'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
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

exports.DocumentSearch = validEntityDecorator(DocumentSearch);
