const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

DeadlineSearch.validationName = 'DeadlineSearch';

DeadlineSearch.VALID_DATE_SEARCH_FORMATS = [
  'YYYY/MM/DD',
  'YYYY/MM/D',
  'YYYY/M/DD',
  'YYYY/M/D',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
];

/**
 * Deadline Search entity
 *
 * @param {object} rawProps the raw document search data
 * @constructor
 */
function DeadlineSearch(rawProps = {}) {
  this.startDate = rawProps.startDate;
  this.endDate = rawProps.endDate;
}

DeadlineSearch.VALIDATION_ERROR_MESSAGES = {
  endDate: [
    {
      contains: 'ref:startDate',
      message: 'A start date must also be provided.',
    },
    {
      contains: 'is required',
      message: 'Enter an End date.',
    },
    'Enter a valid end date',
  ],
  startDate: [
    {
      contains: 'is required',
      message: 'Enter a Start date.',
    },
    'Enter a valid start date',
  ],
};

DeadlineSearch.schema = joi.object().keys({
  endDate: JoiValidationConstants.ISO_DATE.format(
    DeadlineSearch.VALID_DATE_SEARCH_FORMATS,
  )
    .min(joi.ref('startDate'))
    .required()
    .description(
      'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
    ),
  startDate: JoiValidationConstants.ISO_DATE.format(
    DeadlineSearch.VALID_DATE_SEARCH_FORMATS,
  )
    .required()
    .description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    ),
});

joiValidationDecorator(
  DeadlineSearch,
  DeadlineSearch.schema,
  DeadlineSearch.VALIDATION_ERROR_MESSAGES,
);

module.exports = { DeadlineSearch };
