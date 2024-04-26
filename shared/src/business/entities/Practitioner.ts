import {
  ADMISSIONS_STATUS_OPTIONS,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from './EntityConstants';
import { JoiValidationConstants } from './JoiValidationConstants';
import { User } from './User';
import joi from 'joi';

export class Practitioner extends User {
  public additionalPhone?: string;
  public admissionsDate: string;
  public admissionsStatus: string;
  public barNumber: string;
  public birthYear: string;
  public confirmEmail?: string;
  public practiceType: string;
  public firmName?: string;
  public firstName: string;
  public lastName: string;
  public middleName?: string;
  public originalBarState: string;
  public practitionerNotes?: string;
  public practitionerType: string;
  public serviceIndicator: string;
  public suffix?: string;
  public updatedEmail?: string;

  constructor(rawUser, options?) {
    super(rawUser, options);

    this.entityName = Practitioner.ENTITY_NAME;

    this.additionalPhone = rawUser.additionalPhone;
    this.admissionsDate = rawUser.admissionsDate;
    this.admissionsStatus = rawUser.admissionsStatus;
    this.barNumber = rawUser.barNumber;
    this.birthYear = rawUser.birthYear;
    this.confirmEmail = rawUser.confirmEmail;
    this.practiceType = rawUser.practiceType;
    this.firmName = rawUser.firmName;
    this.firstName = rawUser.firstName;
    this.lastName = rawUser.lastName;
    this.middleName = rawUser.middleName;
    this.name = Practitioner.getFullName(rawUser);
    this.originalBarState = rawUser.originalBarState;
    this.practitionerNotes = rawUser.practitionerNotes;
    this.practitionerType = rawUser.practitionerType;
    this.section = this.role;
    this.suffix = rawUser.suffix;
    this.serviceIndicator =
      rawUser.serviceIndicator ||
      Practitioner.getDefaultServiceIndicator(rawUser);
    this.updatedEmail = rawUser.updatedEmail;
    if (this.admissionsStatus === 'Active') {
      this.role = Practitioner.ROLE_MAP[this.practiceType];
    } else {
      this.role = ROLES.inactivePractitioner;
    }
  }

  static ENTITY_NAME = 'Practitioner';

  static ROLE_MAP = {
    DOJ: ROLES.irsPractitioner,
    IRS: ROLES.irsPractitioner,
    Private: ROLES.privatePractitioner,
  };

  static VALIDATION_RULES = {
    ...super.VALIDATION_RULES,
    additionalPhone: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null)
      .description('An alternate phone number for the practitioner.'),
    admissionsDate: JoiValidationConstants.DATE.max('now')
      .required()
      .description(
        'The date the practitioner was admitted to the Tax Court bar.',
      )
      .messages({
        '*': 'Enter an admission date',
        'date.max':
          'Admission date cannot be in the future. Enter a valid date.',
      }),
    admissionsStatus: JoiValidationConstants.STRING.valid(
      ...ADMISSIONS_STATUS_OPTIONS,
    )
      .required()
      .description('The Tax Court bar admission status for the practitioner.')
      .messages({ '*': 'Select an admission status' }),
    barNumber: JoiValidationConstants.STRING.max(100)
      .required()
      .description(
        'A unique identifier comprising of the practitioner initials, date, and series number.',
      )
      .messages({ '*': 'Bar number is required' }),
    birthYear: JoiValidationConstants.YEAR_MAX_CURRENT.required()
      .description('The year the practitioner was born.')
      .messages({
        '*': 'Enter a valid birth year',
        'date.max': 'Birth year cannot be in the future. Enter a valid year.',
      }),
    confirmEmail: JoiValidationConstants.EMAIL.when('updatedEmail', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.valid(joi.ref('updatedEmail')).required(),
    }).messages({
      'any.only': 'Email addresses do not match',
      'any.required': 'Enter a valid email address',
      'string.email': 'Enter a valid email address',
    }),
    entityName: JoiValidationConstants.STRING.valid('Practitioner').required(),
    firmName: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null)
      .description('The firm name for the practitioner.'),
    firstName: JoiValidationConstants.STRING.max(100)
      .required()
      .description('The first name of the practitioner.'),
    lastName: JoiValidationConstants.STRING.max(100)
      .required()
      .description('The last name of the practitioner.'),
    middleName: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null)
      .description('The optional middle name of the practitioner.'),
    originalBarState: JoiValidationConstants.STRING.valid(
      ...Object.keys(US_STATES),
      ...Object.keys(US_STATES_OTHER),
      STATE_NOT_AVAILABLE,
    )
      .required()
      .description(
        'The state in which the practitioner passed their bar examination.',
      )
      .messages({ '*': 'Select an original bar state' }),
    practiceType: JoiValidationConstants.STRING.valid(...PRACTICE_TYPE_OPTIONS)
      .required()
      .description('The practice type of the practitioner.')
      .messages({ '*': 'Select a practice type' }),
    practitionerNotes: JoiValidationConstants.STRING.max(500)
      .optional()
      .allow(null, '')
      .description('The optional notes of the practitioner.')
      .messages({
        '*': 'Enter valid notes',
        'string.max': 'Limit is 500 characters. Enter 500 or fewer characters',
      }),
    practitionerType: JoiValidationConstants.STRING.valid(
      ...PRACTITIONER_TYPE_OPTIONS,
    )
      .required()
      .description(
        'The type of practitioner - either Attorney or Non-Attorney.',
      )
      .messages({ '*': 'Select a practitioner type' }),
    role: joi.alternatives().conditional('admissionsStatus', {
      is: joi.valid('Active'),
      otherwise: JoiValidationConstants.STRING.valid(
        ROLES.inactivePractitioner,
      ).required(),
      then: JoiValidationConstants.STRING.valid(
        ...[ROLES.irsPractitioner, ROLES.privatePractitioner],
      ).required(),
    }),
    serviceIndicator: JoiValidationConstants.STRING.valid(
      ...Object.values(SERVICE_INDICATOR_TYPES),
    ).required(),
    suffix: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow('')
      .description('The name suffix of the practitioner.'),
    updatedEmail: joi
      .alternatives()
      .conditional('confirmEmail', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.EMAIL.optional().allow(null),
        then: JoiValidationConstants.EMAIL.required(),
      })
      .messages({ '*': 'Enter a valid email address' }),
  };

  getValidationRules() {
    return Practitioner.VALIDATION_RULES as any;
  }

  toRawObject() {
    const result = super.toRawObject() as any;

    // We don't want to persist these values as they are only used for validation
    result.confirmEmail = undefined;
    result.updatedEmail = undefined;

    return result;
  }

  static getFullName(practitionerData: {
    firstName: string;
    lastName: string;
    middleName?: string;
    suffix?: string;
  }): string {
    const { firstName, lastName } = practitionerData;
    const middleName = practitionerData.middleName
      ? ' ' + practitionerData.middleName
      : '';
    const suffix = practitionerData.suffix ? ' ' + practitionerData.suffix : '';

    return `${firstName}${middleName} ${lastName}${suffix}`;
  }

  static getDefaultServiceIndicator(practitionerData: {
    email?: string;
  }): string {
    return practitionerData.email
      ? SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
      : SERVICE_INDICATOR_TYPES.SI_PAPER;
  }
}

export type RawPractitioner = ExcludeMethods<Practitioner>;
