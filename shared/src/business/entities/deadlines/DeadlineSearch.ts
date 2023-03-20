const joi = require('joi').extend(require('@hapi/joi-date'));
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');

DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS = ['MM/DD/YYYY'];

/**
 * Deadline Search entity
 *
 * @param {object} rawProps the raw document search data
 * @constructor
 */
function DeadlineSearch() {
  this.entityName = 'DeadlineSearch';
}

DeadlineSearch.prototype.init = function init(rawProps = {}) {
  this.startDate = rawProps.startDate;
  this.endDate = rawProps.endDate;
};

DeadlineSearch.VALIDATION_ERROR_MESSAGES = {
  endDate: [
    {
      contains: 'ref:startDate',
      message:
        'End date cannot be prior to Start Date. Enter a valid End date.',
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
  endDate: joi
    .date()
    .iso()
    .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
    .min(joi.ref('startDate'))
    .required()
    .description(
      'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
    ),
  startDate: joi
    .date()
    .iso()
    .format(DeadlineSearch.JOI_VALID_DATE_SEARCH_FORMATS)
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

exports.DeadlineSearch = validEntityDecorator(DeadlineSearch);
