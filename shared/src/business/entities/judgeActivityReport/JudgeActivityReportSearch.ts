const joi = require('joi').extend(require('@hapi/joi-date'));
const {
  calculateISODate,
  createEndOfDayISO,
  createStartOfDayISO,
} = require('../../utilities/DateHandler');
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
  if (rawProps.startDate) {
    const [month, day, year] = rawProps.startDate.split('/'); // 11/31/2019
    if (month && day && year) {
      this.startDate = createStartOfDayISO({
        day,
        month,
        year,
      });
    }
  }

  if (rawProps.endDate) {
    const [month, day, year] = rawProps.endDate.split('/');
    if (month && day && year) {
      this.endDate = createEndOfDayISO({
        day,
        month,
        year,
      });
      this.tomorrow = calculateISODate({
        howMuch: +1,
        units: 'days',
      });
    }
  }
};

JudgeActivityReportSearch.VALIDATION_ERROR_MESSAGES = {
  endDate: [
    {
      contains: 'ref:startDate',
      message:
        'End date cannot be prior to Start Date. Enter a valid end date.',
    },
    {
      contains: 'ref:tomorrow',
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
  endDate: JoiValidationConstants.ISO_DATE.required()
    .less(joi.ref('tomorrow'))
    .min(joi.ref('startDate'))
    .description(
      'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
    ),
  startDate: JoiValidationConstants.ISO_DATE.max('now')
    .required()
    .description(
      'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
    ),
  tomorrow: joi
    .optional()
    .description(
      'The computed value to validate the endDate against, in order to verify that the endDate is less than or equal to the current date',
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
