import {
  IValidationEntity,
  TStaticValidationMethods,
  joiValidationDecorator,
  validEntityDecorator,
} from './JoiValidationDecorator';
import { JoiValidationConstants } from './JoiValidationConstants';
import { Practitioner } from './Practitioner';
import { ROLES, SERVICE_INDICATOR_TYPES } from './EntityConstants';
import {
  USER_CONTACT_VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES,
  userDecorator,
} from './User';
import joi from 'joi';

export const entityName = 'IrsPractitioner';

export class IrsPractitionerClass {
  public barNumber: string;
  public serviceIndicator: string;
  public entityName: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawUser, { filtered = false } = {}) {
    this.entityName = entityName;
  }

  init(rawUser, { filtered = false } = {}) {
    userDecorator(this, rawUser, filtered);
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
}

joiValidationDecorator(
  IrsPractitionerClass,
  IrsPractitionerClass.VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES,
);

export const IrsPractitioner: typeof IrsPractitionerClass &
  TStaticValidationMethods<RawIrsPractitioner> =
  validEntityDecorator(IrsPractitionerClass);

declare global {
  type RawIrsPractitioner = ExcludeMethods<IrsPractitionerClass>;
}
// eslint-disable-next-line no-redeclare
export interface IrsPractitionerClass
  extends IValidationEntity<IrsPractitionerClass> {}
