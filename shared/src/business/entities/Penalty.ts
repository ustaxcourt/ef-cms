import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { PENALTY_TYPES } from './EntityConstants';
import joi from 'joi';

export class Penalty extends JoiValidationEntity {
  public name: string;
  public penaltyAmount: string;
  public penaltyId: string;
  public penaltyType: string;
  public statisticId: string;

  constructor(rawProps, { applicationContext }) {
    super('Penalty');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.name = rawProps.name;
    this.penaltyType = rawProps.penaltyType;
    this.penaltyAmount = rawProps.penaltyAmount;
    this.penaltyId = rawProps.penaltyId || applicationContext.getUniqueId();
    this.statisticId = rawProps.statisticId;
  }

  static VALIDATION_RULES = joi.object().keys({
    entityName: JoiValidationConstants.STRING.valid('Penalty').required(),
    name: JoiValidationConstants.STRING.max(50)
      .required()
      .description('Penalty name.')
      .messages({ '*': 'Penalty name is required.' }),
    penaltyAmount: joi
      .number()
      .required()
      .description('The dollar amount of the penalty.')
      .messages({ '*': 'Enter penalty amount.' }),
    penaltyId: JoiValidationConstants.UUID.required().description(
      'Unique Penalty ID only used by the system.',
    ),
    penaltyType: JoiValidationConstants.STRING.required()
      .valid(...Object.values(PENALTY_TYPES))
      .description('The type of penalty (IRS or Court Determination).')
      .messages({ '*': 'Penalty type is required.' }),
    statisticId: JoiValidationConstants.UUID.required()
      .description('Unique statistic ID only used by the system.')
      .messages({ '*': 'Statistic ID is required.' }),
  });

  getValidationRules() {
    return Penalty.VALIDATION_RULES;
  }
}

export type RawPenalty = ExcludeMethods<Penalty>;
