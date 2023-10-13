import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from './EntityConstants';
import { USER_CONTACT_VALIDATION_RULES, User } from './User';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export const entityName = 'PrivatePractitioner';

export class PrivatePractitioner extends User {
  public entityName: string;
  public barNumber: string;
  public firmName: string;
  public representing: string;
  public serviceIndicator: string;

  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = entityName;
    this.barNumber = rawUser.barNumber;
    this.firmName = rawUser.firmName;
    this.representing = rawUser.representing || [];
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
    entityName: JoiValidationConstants.STRING.valid(
      'PrivatePractitioner',
    ).required(),
    firmName: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null)
      .description('The firm name for the practitioner.'),
    name: JoiValidationConstants.STRING.max(100).required(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID)
      .optional()
      .description('List of contact IDs of contacts'),
    role: JoiValidationConstants.STRING.required().valid(
      ROLES.privatePractitioner,
    ),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).required(),
    token: JoiValidationConstants.STRING.optional(),
    userId: JoiValidationConstants.UUID.required(),
  });

  isRepresenting(petitionerContactId) {
    return this.representing.includes(petitionerContactId);
  }

  getValidationRules() {
    return PrivatePractitioner.VALIDATION_RULES as any;
  }

  static VALIDATION_RULES_NEW = joi.object().keys({
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      ),
    contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
    email: JoiValidationConstants.EMAIL.optional(),
    entityName: JoiValidationConstants.STRING.valid(
      'PrivatePractitioner',
    ).required(),
    firmName: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null)
      .description('The firm name for the practitioner.'),
    name: JoiValidationConstants.STRING.max(100)
      .required()
      .messages(setDefaultErrorMessage('Enter name')),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID)
      .optional()
      .description('List of contact IDs of contacts'),
    role: JoiValidationConstants.STRING.required().valid(
      ROLES.privatePractitioner,
    ),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).required(),
    token: JoiValidationConstants.STRING.optional(),
    userId: JoiValidationConstants.UUID.required(),
  });

  getValidationRules_NEW() {
    return PrivatePractitioner.VALIDATION_RULES_NEW as any;
  }
}

declare global {
  type RawPrivatePractitioner = ExcludeMethods<PrivatePractitioner>;
}
