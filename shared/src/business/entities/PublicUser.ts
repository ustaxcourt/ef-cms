import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { ROLES } from './EntityConstants';
import joi from 'joi';

export class PublicUser extends JoiValidationEntity {
  public name: string;
  public role: string;
  public judgeFullName?: string;
  public judgeTitle?: string;

  constructor(rawUser) {
    super('PublicUser');
    this.name = rawUser.name;
    this.role = rawUser.role;
    if (this.role === ROLES.judge || this.role === ROLES.legacyJudge) {
      this.judgeFullName = rawUser.judgeFullName;
      this.judgeTitle = rawUser.judgeTitle;
    }
  }

  static VALIDATION_RULES = {
    judgeFullName: JoiValidationConstants.STRING.max(100).when('role', {
      is: ROLES.judge,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    judgeTitle: JoiValidationConstants.STRING.max(100).when('role', {
      is: ROLES.judge,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages({ '*': 'Enter name' }),
    role: JoiValidationConstants.STRING.valid(...Object.values(ROLES))
      .required()
      .messages({ '*': 'Role is required' }),
  };

  getValidationRules() {
    return PublicUser.VALIDATION_RULES;
  }
}

export type RawPublicUser = ExcludeMethods<PublicUser>;
