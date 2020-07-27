const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

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

  this.determinationDeficiencyAmount =
    rawStatistic.determinationDeficiencyAmount;
  this.determinationTotalPenalties = rawStatistic.determinationTotalPenalties;
  this.irsDeficiencyAmount = rawStatistic.irsDeficiencyAmount;
  this.irsTotalPenalties = rawStatistic.irsTotalPenalties;
  this.lastDateOfPeriod = rawStatistic.lastDateOfPeriod;
  this.year = rawStatistic.year;
  this.yearOrPeriod = rawStatistic.yearOrPeriod;
  this.statisticId =
    rawStatistic.statisticId || applicationContext.getUniqueId();
}

Statistic.validationName = 'Statistic';

Statistic.VALIDATION_ERROR_MESSAGES = {
  determinationDeficiencyAmount: 'Enter deficiency as determined by Court',
  determinationTotalPenalties: 'Enter total penalties as determined by Court',
  irsDeficiencyAmount: 'Enter deficiency on IRS Notice',
  irsTotalPenalties: 'Enter total penalties on IRS Notice',
  lastDateOfPeriod: [
    {
      contains: 'must be less than or equal to',
      message: 'Enter valid last date of period',
    },
    'Enter last date of period',
  ],
  year: 'Enter a valid year',
};

joiValidationDecorator(
  Statistic,
  joi.object().keys({
    determinationDeficiencyAmount: joi
      .alternatives()
      .conditional('determinationTotalPenalties', {
        is: joi.exist().not(null),
        otherwise: joi.number().optional().allow(null),
        then: joi.number().required(),
      })
      .description('The amount of the deficiency determined by the Court.'),
    determinationTotalPenalties: joi
      .alternatives()
      .conditional('determinationDeficiencyAmount', {
        is: joi.exist().not(null),
        otherwise: joi.number().optional().allow(null),
        then: joi.number().required(),
      })
      .description(
        'The total amount of penalties for the period or year determined by the Court.',
      ),
    entityName: joi.string().valid('Statistic').required(),
    irsDeficiencyAmount: joi
      .number()
      .required()
      .description('The amount of the deficiency on the IRS notice.'),
    irsTotalPenalties: joi
      .number()
      .required()
      .description(
        'The total amount of penalties for the period or year on the IRS notice.',
      ),
    lastDateOfPeriod: JoiValidationConstants.ISO_DATE.max('now')
      .when('yearOrPeriod', {
        is: 'Period',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .description('Last date of the statistics period.'),
    statisticId: JoiValidationConstants.UUID.required().description(
      'Unique statistic ID only used by the system.',
    ),
    year: joi
      .number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .when('yearOrPeriod', {
        is: 'Year',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .description('The year of the statistics period.'),
    yearOrPeriod: joi
      .string()
      .required()
      .valid('Year', 'Period')
      .description('Whether the statistics are for a year or period.'),
  }),
  Statistic.VALIDATION_ERROR_MESSAGES,
);

module.exports = { Statistic };
