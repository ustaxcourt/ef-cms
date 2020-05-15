const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getTimestampSchema } = require('../../utilities/dateSchema');

const joiStrictTimestamp = getTimestampSchema();

/**
 * Statistic constructor
 *
 * @param {object} rawStatistic the raw statistic data
 * @constructor
 */
function Statistic(rawStatistic, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'Statistic';

  this.deficiencyAmount = rawStatistic.deficiencyAmount;
  this.lastDateOfPeriod = rawStatistic.lastDateOfPeriod;
  this.totalPenalties = rawStatistic.totalPenalties;
  this.year = rawStatistic.year;
  this.yearOrPeriod = rawStatistic.yearOrPeriod;
}

Statistic.validationName = 'Statistic';

Statistic.VALIDATION_ERROR_MESSAGES = {
  lastDateOfPeriod: [
    {
      contains: 'must be less than or equal to',
      message: 'Enter a valid last date of period',
    },
  ],
};

joiValidationDecorator(
  Statistic,
  joi.object().keys({
    deficiencyAmount: joi
      .number()
      .optional()
      .allow(null)
      .description('The amount of the deficiency.'),
    entityName: joi.string().valid('Statistic').required(),
    lastDateOfPeriod: joiStrictTimestamp
      .max('now')
      .optional()
      .allow(null)
      .description('Last date of the statistics period.'),
    totalPenalties: joi
      .number()
      .optional()
      .allow(null)
      .description('The total amount of penalties for the period or year.'),
    year: joi
      .number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .optional()
      .allow(null)
      .description('The year of the statistics period.'),
    yearOrPeriod: joi
      .string()
      .required()
      .valid('year', 'period')
      .description('Whether the statistics are for a year or period.'),
  }),
  Statistic.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Statistic };
