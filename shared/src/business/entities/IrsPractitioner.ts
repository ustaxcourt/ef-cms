import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from './EntityConstants';
import {
  USER_CONTACT_VALIDATION_RULES,
  User,
  VALIDATION_ERROR_MESSAGES,
} from './User';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export const entityName = 'IrsPractitioner';

export class IrsPractitioner extends User {
  public barNumber: string;
  public serviceIndicator: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = 'IrsPractitioner';
    this.barNumber = rawUser.barNumber;
    this.serviceIndicator =
      rawUser.serviceIndicator ||
      Practitioner.getDefaultServiceIndicator(rawUser);
  }

  static VALIDATION_RULES = joi.object().keys({
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      ),
    contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
    email: JoiValidationConstants.EMAIL.optional(),
    entityName:
      JoiValidationConstants.STRING.valid('IrsPractitioner').required(),
    name: JoiValidationConstants.STRING.max(100).required(),
    role: JoiValidationConstants.STRING.valid(ROLES.irsPractitioner).required(),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).required(),
    token: JoiValidationConstants.STRING.optional(),
    userId: JoiValidationConstants.UUID.required(),
  });

  getValidationRules() {
    return IrsPractitioner.VALIDATION_RULES as any;
  }

  static VALIDATION_RULES_NEW = joi.object().keys({
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      ),
    contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
    email: JoiValidationConstants.EMAIL.optional(),
    entityName:
      JoiValidationConstants.STRING.valid('IrsPractitioner').required(),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages(setDefaultErrorMessage('Enter name')),
    role: JoiValidationConstants.STRING.valid(ROLES.irsPractitioner).required(),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).required(),
    token: JoiValidationConstants.STRING.optional(),
    userId: JoiValidationConstants.UUID.required(),
  });

  getValidationRules_NEW() {
    return IrsPractitioner.VALIDATION_RULES_NEW as any;
  }

  getErrorToMessageMap() {
    return VALIDATION_ERROR_MESSAGES;
  }
}

declare global {
  type RawIrsPractitioner = ExcludeMethods<IrsPractitioner>;
}
