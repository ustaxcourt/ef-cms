import { ExcludeMethods } from 'types/TEntity';
import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from './EntityConstants';
import { User } from './User';
import joi from 'joi';

export class IrsPractitioner extends User {
  public barNumber: string;
  public serviceIndicator: string;

  constructor(rawUser, options?) {
    super(rawUser, options);

    this.entityName = IrsPractitioner.ENTITY_NAME;

    this.barNumber = rawUser.barNumber;
    this.serviceIndicator =
      rawUser.serviceIndicator ||
      Practitioner.getDefaultServiceIndicator(rawUser);
  }

  static ENTITY_NAME = 'IrsPractitioner';

  static VALIDATION_RULES = joi.object().keys({
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      ),
    contact: joi.object().keys(User.USER_CONTACT_VALIDATION_RULES).optional(),
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
}

export type RawIrsPractitioner = ExcludeMethods<IrsPractitioner>;
