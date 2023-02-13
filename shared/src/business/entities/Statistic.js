const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
const { Penalty } = require('./Penalty');
const { PENALTY_TYPES } = require('../entities/EntityConstants');

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
  this.penalties = [];
  if (
    rawStatistic.penalties &&
    rawStatistic.penalties.length > 0 &&
    rawStatistic.irsTotalPenalties
  ) {
    assignPenalties(this, {
      applicationContext,
      rawPenalties: rawStatistic.penalties,
      statisticId: this.statisticId,
    });
  } else if (rawStatistic.irsTotalPenalties) {
    itemizeTotalPenalties(this, {
      applicationContext,
      determinationTotalPenalties: this.determinationTotalPenalties,
      irsTotalPenalties: this.irsTotalPenalties,
    });
  }
};

Statistic.VALIDATION_ERROR_MESSAGES = {
  determinationDeficiencyAmount: 'Enter deficiency as determined by Court.',
  determinationTotalPenalties: 'Enter total penalties as determined by Court.',
  irsDeficiencyAmount: 'Enter deficiency on IRS Notice.',
  irsTotalPenalties: 'Enter total penalties on IRS Notice.',
  lastDateOfPeriod: [
    {
      contains: 'must be less than or equal to',
      message: 'Enter valid last date of period',
    },
    'Enter last date of period',
  ],
  penalties: 'Enter at least one IRS penalty.',
  year: 'Enter a valid year.',
};

Statistic.VALIDATION_RULES = joi.object().keys({
  determinationDeficiencyAmount: joi
    .alternatives()
    .conditional('determinationTotalPenalties', {
      is: joi.exist().not(null),
      otherwise: joi.number().positive().allow(0).optional().allow(null),
      then: joi.number().positive().allow(0).required(),
    })
    .description('The amount of the deficiency determined by the Court.'),
  determinationTotalPenalties: joi
    .alternatives()
    .conditional('determinationDeficiencyAmount', {
      is: joi.exist().not(null),
      otherwise: joi.number().positive().allow(0).optional().allow(null),
      then: joi.number().positive().allow(0).required(),
    })
    .description(
      'The total amount of penalties for the period or year determined by the Court.',
    ),
  entityName: JoiValidationConstants.STRING.valid('Statistic').required(),
  irsDeficiencyAmount: joi
    .number()
    .positive()
    .allow(0)
    .required()
    .description('The amount of the deficiency on the IRS notice.'),
  irsTotalPenalties: joi
    .number()
    .positive()
    .allow(0)
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
    .has(
      joi.object().keys({
        penaltyType: joi.string().valid(PENALTY_TYPES.IRS_PENALTY_AMOUNT),
      }),
    )
    .required()
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

const assignPenalties = (
  obj,
  { applicationContext, rawPenalties, statisticId },
) => {
  rawPenalties.forEach(penalty => {
    penalty.statisticId
      ? obj.addPenalty({ applicationContext, rawPenalty: penalty })
      : obj.addPenalty({
          applicationContext,
          rawPenalty: { ...penalty, statisticId },
        });
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

const itemizeTotalPenalties = function (
  obj,
  { applicationContext, determinationTotalPenalties, irsTotalPenalties },
) {
  obj.addPenalty({
    applicationContext,
    rawPenalty: {
      name: 'Penalty 1 (IRS)',
      penaltyAmount: irsTotalPenalties,
      penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      statisticId: obj.statisticId,
    },
  });

  if (determinationTotalPenalties) {
    obj.addPenalty({
      applicationContext,
      rawPenalty: {
        name: 'Penalty 1 (Court)',
        penaltyAmount: determinationTotalPenalties,
        penaltyType: PENALTY_TYPES.DETERMINATION_PENALTY_AMOUNT,
        statisticId: obj.statisticId,
      },
    });
  }
};

exports.Statistic = validEntityDecorator(Statistic);
