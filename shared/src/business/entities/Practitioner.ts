import {
  ADMISSIONS_STATUS_OPTIONS,
  EMPLOYER_OPTIONS,
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
  public employer: string;
  public firmName: string;
  public firstName: string;
  public lastName: string;
  public middleName: string;
  public name: string;
  public originalBarState: string;
  public practitionerNotes: string;
  public practitionerType: string;
  public section: string;
  public suffix: string;
  public serviceIndicator: string;
  public updatedEmail: string;

  constructor(rawUser, options?) {
    super(rawUser, options);
    this.entityName = entityName;
    this.additionalPhone = rawUser.additionalPhone;
    this.admissionsDate = rawUser.admissionsDate;
    this.admissionsStatus = rawUser.admissionsStatus;
    this.barNumber = rawUser.barNumber;
    this.birthYear = rawUser.birthYear;
    this.confirmEmail = rawUser.confirmEmail;
    this.employer = rawUser.employer;
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
      this.role = roleMap[this.employer];
    } else {
      this.role = ROLES.inactivePractitioner;
    }
  }

  static VALIDATION_ERROR_MESSAGES = {
    ...User.VALIDATION_ERROR_MESSAGES,
    admissionsDate: [
      {
        contains: 'must be less than or equal to',
        message: 'Admission date cannot be in the future. Enter a valid date.',
      },
      'Enter an admission date',
    ],
    admissionsStatus: 'Select an admission status',
    barNumber: 'Bar number is required',
    birthYear: [
      {
        contains: 'must be less than or equal to',
        message: 'Birth year cannot be in the future. Enter a valid year.',
      },
      'Enter a valid birth year',
    ],
    confirmEmail: [
      {
        contains: 'must be [ref:updatedEmail]',
        message: 'Email addresses do not match',
      },
      { contains: 'is required', message: 'Enter a valid email address' },
      { contains: 'must be a valid', message: 'Enter a valid email address' },
    ],
    employer: 'Select an employer',
    originalBarState: 'Select an original bar state',
    practitionerNotes: [
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 500 characters. Enter 500 or fewer characters',
      },
      'Enter valid notes',
    ],
    practitionerType: 'Select a practitioner type',
    updatedEmail: 'Enter a valid email address',
  };

  getErrorToMessageMap() {
    return Practitioner.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      additionalPhone: JoiValidationConstants.STRING.max(100)
        .optional()
        .allow(null)
        .description('An alternate phone number for the practitioner.'),
      admissionsDate: JoiValidationConstants.DATE.max('now')
        .required()
        .description(
          'The date the practitioner was admitted to the Tax Court bar.',
        ),
      admissionsStatus: JoiValidationConstants.STRING.valid(
        ...ADMISSIONS_STATUS_OPTIONS,
      )
        .required()
        .description(
          'The Tax Court bar admission status for the practitioner.',
        ),
      barNumber: JoiValidationConstants.STRING.max(100)
        .required()
        .description(
          'A unique identifier comprising of the practitioner initials, date, and series number.',
        ),
      birthYear: JoiValidationConstants.YEAR_MAX_CURRENT.required().description(
        'The year the practitioner was born.',
      ),
      confirmEmail: JoiValidationConstants.EMAIL.when('updatedEmail', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.valid(joi.ref('updatedEmail')).required(),
      }),
      employer: JoiValidationConstants.STRING.valid(...EMPLOYER_OPTIONS)
        .required()
        .description('The employer designation for the practitioner.'),
      entityName:
        JoiValidationConstants.STRING.valid('Practitioner').required(),
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
        ),
      practitionerNotes: JoiValidationConstants.STRING.max(500)
        .optional()
        .allow(null, '')
        .description('The optional notes of the practitioner.'),
      practitionerType: JoiValidationConstants.STRING.valid(
        ...PRACTITIONER_TYPE_OPTIONS,
      )
        .required()
        .description(
          'The type of practitioner - either Attorney or Non-Attorney.',
        ),
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
      updatedEmail: joi.alternatives().conditional('confirmEmail', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.EMAIL.optional().allow(null),
        then: JoiValidationConstants.EMAIL.required(),
      }),
    };
  }

  toRawObject() {
    const result = super.toRawObjectFromJoi() as any;

    // We don't want to persist these values as they are only used for validation
    result.confirmEmail = undefined;
    result.updatedEmail = undefined;

    return result;
  }

  /**
   * returns the full concatenated name for the given practitioner data
   * @param {object} practitionerData data to pull name parts from
   * @returns {string} the concatenated firstName, middleName, and lastName with suffix
   */
  static getFullName(practitionerData) {
    const { firstName, lastName } = practitionerData;
    const middleName = practitionerData.middleName
      ? ' ' + practitionerData.middleName
      : '';
    const suffix = practitionerData.suffix ? ' ' + practitionerData.suffix : '';

    return `${firstName}${middleName} ${lastName}${suffix}`;
  }

  /**
   * returns a default service indicator based on whether the presence of an email address
   * @param {object} practitionerData data where an email may exist
   * @returns {string} the service indicator for the given condition
   */
  static getDefaultServiceIndicator(practitionerData) {
    return practitionerData.email
      ? SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
      : SERVICE_INDICATOR_TYPES.SI_PAPER;
  }
}

const roleMap = {
  DOJ: ROLES.irsPractitioner,
  IRS: ROLES.irsPractitioner,
  Private: ROLES.privatePractitioner,
};

declare global {
  type RawPractitioner = ExcludeMethods<Practitioner>;
}

export const entityName = 'Practitioner';
