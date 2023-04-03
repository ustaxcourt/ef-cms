const joi = require('joi').extend(require('@hapi/joi-date'));
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
import { JoiValidationConstants } from '../JoiValidationConstants';

/**
 * Judge Activity Report Search Entity
 *
 * @param {object} rawProps the raw activity search data
 * @constructor
 */
function JudgeActivityReportSearch() {
  this.entityName = 'JudgeActivityReportSearch';
}

JudgeActivityReportSearch.prototype.init = function init(rawProps = {}) {
  this.startDate = rawProps.startDate;
  this.endDate = rawProps.endDate;
};

JudgeActivityReportSearch.VALIDATION_ERROR_MESSAGES = {
  endDate: [
    {
      contains: 'ref:startDate',
      message:
        'End date cannot be prior to Start Date. Enter a valid End date.',
    },
    {
      contains: 'must be less than or equal to',
      message: 'End date cannot be in the future. Enter a valid date.',
    },
    {
      contains: 'is required',
      message: 'Enter an end date.',
    },
    'Enter a valid end date',
  ],
  startDate: [
    {
      contains: 'is required',
      message: 'Enter a start date.',
    },
    {
      contains: 'must be less than or equal to',
      message: 'Start date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid start date',
  ],
};

JudgeActivityReportSearch.schema = joi.object().keys({
  endDate: JoiValidationConstants.ISO_DATE.min(joi.ref('startDate'))
    .max('now')
    .required()
    .description(
      'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
    ),
  startDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    ),
});

joiValidationDecorator(
  JudgeActivityReportSearch,
  JudgeActivityReportSearch.schema,
  JudgeActivityReportSearch.VALIDATION_ERROR_MESSAGES,
);

exports.JudgeActivityReportSearch = validEntityDecorator(
  JudgeActivityReportSearch,
);
