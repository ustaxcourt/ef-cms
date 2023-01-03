const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { Penalty } = require('./Penalty');

/**
 * Statistic constructor
 *
 * @param {object} rawStatistic the raw statistic data
 * @constructor
 */
function Statistic() {
  this.entityName = 'Statistic';
}

Statistic.prototype.init = function init(rawStatistic, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

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
  // temporary until migration is written - this allows us for now to run api locally
  this.penalties = Array.isArray(rawStatistic.penalties)
    ? assignPenalties({
        applicationContext,
        rawPenalties: rawStatistic.penalties,
        statisticId: this.statisticId,
      })
    : [
        new Penalty(
          {
            irsPenaltyAmount: this.irsTotalPenalties,
            name: 'Penalty 1',
            statisticId: this.statisticId,
          },
          { applicationContext },
        ),
      ];

  this.irsTotalPenalties =
    this.penalties.reduce((sum, penalty) => penalty.irsPenaltyAmount + sum) ??
    0;
};

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

Statistic.VALIDATION_RULES = joi.object().keys({
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
  entityName: JoiValidationConstants.STRING.valid('Statistic').required(),
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
  penalties: joi
    .array()
    .min(1)
    .description('List of Penalty Entities for the statistic.'),
  statisticId: JoiValidationConstants.UUID.required().description(
    'Unique statistic ID only used by the system.',
  ),
  year: JoiValidationConstants.YEAR_MAX_CURRENT.when('yearOrPeriod', {
    is: 'Year',
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }).description('The year of the statistics period.'),
  yearOrPeriod: JoiValidationConstants.STRING.required()
    .valid('Year', 'Period')
    .description('Whether the statistics are for a year or period.'),
});

joiValidationDecorator(
  Statistic,
  Statistic.VALIDATION_RULES,
  Statistic.VALIDATION_ERROR_MESSAGES,
);

const assignPenalties = ({ applicationContext, rawPenalties, statisticId }) => {
  return rawPenalties.map(penalty => {
    return penalty.statisticId
      ? new Penalty(penalty, { applicationContext })
      : new Penalty({ ...penalty, statisticId }, { applicationContext });
  });
};

/**
 *  adds a Penalty object to the Statistic's penalties array
 *
 * @param {Object} penalty  the Penalty object to add
 * @returns {void} modifies the penalties array on the Statistic
 */
Statistic.prototype.addPenalty = function ({ applicationContext, rawPenalty }) {
  const rawPenaltyCopy = { ...rawPenalty };
  if (!rawPenaltyCopy.statisticId) {
    rawPenaltyCopy.statisticId = this.statisticId;
  }
  const penalty = new Penalty(rawPenaltyCopy, { applicationContext });
  this.penalties.push(penalty);
};

/**
 * updates a Penalty on the Statistic's penalties array
 *
 * @param {string} updatedPenalty the penaltyToUpdate Penalty object with updated info
 * @returns {void} modifies the penalties array on the Statistic
 */
Statistic.prototype.updatePenalty = function (updatedPenalty) {
  const foundPenalty = this.penalties.find(
    penalty => penalty.penaltyId === updatedPenalty.penaltyId,
  );

  Object.assign(foundPenalty, updatedPenalty);
};

exports.Statistic = validEntityDecorator(Statistic);
