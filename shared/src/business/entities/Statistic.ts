import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { PENALTY_TYPES } from './EntityConstants';
import { Penalty } from './Penalty';
import joi from 'joi';

/**
 * Statistic constructor
 *
 * @param {object} rawStatistic the raw statistic data
 * @constructor
 */
export class Statistic extends JoiValidationEntity {
  public determinationDeficiencyAmount: string;
  public determinationTotalPenalties: string;
  public irsDeficiencyAmount: string;
  public irsTotalPenalties: string;
  public lastDateOfPeriod: string;
  public year: string;
  public yearOrPeriod: string;
  public statisticId: string;
  public penalties: any[];

  constructor(rawStatistic, { applicationContext }) {
    super('Statistic');
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
  }

  static VALIDATION_RULES = joi.object().keys({
    determinationDeficiencyAmount: joi
      .alternatives()
      .conditional('determinationTotalPenalties', {
        is: joi.exist().not(null),
        otherwise: joi.number().optional().allow(null),
        then: joi.number().required(),
      })
      .description('The amount of the deficiency determined by the Court.')
      .messages({ '*': 'Enter deficiency as determined by Court.' }),
    determinationTotalPenalties: joi
      .alternatives()
      .conditional('determinationDeficiencyAmount', {
        is: joi.exist().not(null),
        otherwise: joi.number().optional().allow(null),
        then: joi.number().required(),
      })
      .description(
        'The total amount of penalties for the period or year determined by the Court.',
      )
      .messages({ '*': 'Enter total penalties as determined by Court.' }),
    entityName: JoiValidationConstants.STRING.valid('Statistic').required(),
    irsDeficiencyAmount: joi
      .number()
      .required()
      .description('The amount of the deficiency on the IRS notice.')
      .messages({ '*': 'Enter deficiency on IRS Notice.' }),
    irsTotalPenalties: joi
      .number()
      .required()
      .description(
        'The total amount of penalties for the period or year on the IRS notice.',
      )
      .messages({ '*': 'Enter total penalties on IRS Notice.' }),
    lastDateOfPeriod: JoiValidationConstants.ISO_DATE.max('now')
      .when('yearOrPeriod', {
        is: 'Period',
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .description('Last date of the statistics period.')
      .messages({
        '*': 'Enter last date of period',
        'date.max': 'Enter valid last date of period',
      }),
    penalties: joi
      .array()
      .has(
        joi.object().keys({
          penaltyType: joi.string().valid(PENALTY_TYPES.IRS_PENALTY_AMOUNT),
        }),
      )
      .required()
      .description('List of Penalty Entities for the statistic.')
      .messages({ '*': 'Enter at least one IRS penalty.' }),
    statisticId: JoiValidationConstants.UUID.required().description(
      'Unique statistic ID only used by the system.',
    ),
    year: JoiValidationConstants.YEAR_MAX_CURRENT.when('yearOrPeriod', {
      is: 'Year',
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
      .description('The year of the statistics period.')
      .messages({ '*': 'Enter a valid year.' }),
    yearOrPeriod: JoiValidationConstants.STRING.required()
      .valid('Year', 'Period')
      .description('Whether the statistics are for a year or period.'),
  });

  /**
   *  adds a Penalty object to the Statistic's penalties array
   *
   * @param {Object} penalty  the Penalty object to add
   * @returns {void} modifies the penalties array on the Statistic
   */
  addPenalty({ applicationContext, rawPenalty }) {
    const rawPenaltyCopy = { ...rawPenalty };
    if (!rawPenaltyCopy.statisticId) {
      rawPenaltyCopy.statisticId = this.statisticId;
    }
    const penalty = new Penalty(rawPenaltyCopy, { applicationContext });
    this.penalties.push(penalty);
  }

  /**
   * updates a Penalty on the Statistic's penalties array
   *
   * @param {string} updatedPenalty the penaltyToUpdate Penalty object with updated info
   * @returns {void} modifies the penalties array on the Statistic
   */
  updatePenalty(updatedPenalty) {
    const foundPenalty = this.penalties.find(
      penalty => penalty.penaltyId === updatedPenalty.penaltyId,
    );

    Object.assign(foundPenalty, updatedPenalty);
  }

  getValidationRules() {
    return Statistic.VALIDATION_RULES;
  }
}

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
