import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { PENALTY_TYPES } from './EntityConstants';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class Penalty extends JoiValidationEntity {
  public name: string;
  public penaltyType: string;
  public penaltyAmount: string;
  public penaltyId: string;
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

  static VALIDATION_ERROR_MESSAGES = {
    name: 'Penalty name is required.',
    penaltyAmount: 'Enter penalty amount.',
    penaltyType: 'Penalty type is required.',
    statisticId: 'Statistic ID is required.',
  };

  static VALIDATION_RULES = joi.object().keys({
    entityName: JoiValidationConstants.STRING.valid('Penalty').required(),
    name: JoiValidationConstants.STRING.max(50)
      .required()
      .description('Penalty name.'),
    penaltyAmount: joi
      .number()
      .required()
      .description('The dollar amount of the penalty.'),
    penaltyId: JoiValidationConstants.UUID.required().description(
      'Unique Penalty ID only used by the system.',
    ),
    penaltyType: JoiValidationConstants.STRING.required()
      .valid(...Object.values(PENALTY_TYPES))
      .description('The type of penalty (IRS or Court Determination).'),
    statisticId: JoiValidationConstants.UUID.required().description(
      'Unique statistic ID only used by the system.',
    ),
  });

  getValidationRules() {
    return Penalty.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = joi.object().keys({
    entityName: JoiValidationConstants.STRING.valid('Penalty').required(),
    name: JoiValidationConstants.STRING.max(50)
      .required()
      .description('Penalty name.')
      .messages(setDefaultErrorMessages('Penalty name is required.')),
    penaltyAmount: joi
      .number()
      .required()
      .description('The dollar amount of the penalty.')
      .messages(setDefaultErrorMessages('Enter penalty amount.')),
    penaltyId: JoiValidationConstants.UUID.required().description(
      'Unique Penalty ID only used by the system.',
    ),
    penaltyType: JoiValidationConstants.STRING.required()
      .valid(...Object.values(PENALTY_TYPES))
      .description('The type of penalty (IRS or Court Determination).')
      .messages(setDefaultErrorMessages('Penalty type is required.')),
    statisticId: JoiValidationConstants.UUID.required()
      .description('Unique statistic ID only used by the system.')
      .messages(setDefaultErrorMessages('Statistic ID is required.')),
  });

  getValidationRules_NEW() {
    return Penalty.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return Penalty.VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawPenalty = ExcludeMethods<Penalty>;
}
