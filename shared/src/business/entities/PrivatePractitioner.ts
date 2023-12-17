import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from './EntityConstants';
import { User } from './User';
import joi from 'joi';

export class PrivatePractitioner extends User {
  public entityName: string;
  public barNumber: string;
  public firmName: string;
  public representing: string;
  public serviceIndicator: string;

  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = PrivatePractitioner.ENTITY_NAME;
    this.barNumber = rawUser.barNumber;
    this.firmName = rawUser.firmName;
    this.representing = rawUser.representing || [];
    this.serviceIndicator =
      rawUser.serviceIndicator ||
      Practitioner.getDefaultServiceIndicator(rawUser);
  }

  static ENTITY_NAME = 'PrivatePractitioner';

  static VALIDATION_RULES = joi.object().keys({
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      ),
    contact: joi.object().keys(User.USER_CONTACT_VALIDATION_RULES).optional(),
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
      .messages({ '*': 'Enter name' }),
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

  getValidationRules() {
    return PrivatePractitioner.VALIDATION_RULES;
  }

  isRepresenting(petitionerContactId) {
    return this.representing.includes(petitionerContactId);
  }
}

export type RawPrivatePractitioner = ExcludeMethods<PrivatePractitioner>;
