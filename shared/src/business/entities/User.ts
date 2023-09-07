import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  COUNTRY_TYPES,
  ROLES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} from './EntityConstants';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { formatPhoneNumber } from '../utilities/formatPhoneNumber';
import joi from 'joi';

export class User extends JoiValidationEntity {
  public pendingEmailVerificationToken?: string;
  public email?: string;
  public name: string;
  public pendingEmail?: string;
  public role: string;
  public token?: string;
  public userId: string;
  public isUpdatingInformation?: boolean;
  public contact?: {
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    country: string;
    countryType: string;
    phone: string;
    postalCode: string;
    state: string;
  };
  public judgeFullName?: string;
  public judgeTitle?: string;
  public section?: string;

  constructor(rawUser, { filtered = false } = {}) {
    super('User');

    if (!filtered) {
      this.pendingEmailVerificationToken =
        rawUser.pendingEmailVerificationToken;
    }

    this.email = rawUser.email;
    this.name = rawUser.name;
    this.pendingEmail = rawUser.pendingEmail;
    this.role = rawUser.role || ROLES.petitioner;
    this.token = rawUser.token;
    this.userId = rawUser.userId;
    this.isUpdatingInformation = rawUser.isUpdatingInformation;
    if (rawUser.contact) {
      this.contact = {
        address1: rawUser.contact.address1,
        address2: rawUser.contact.address2 ? rawUser.contact.address2 : null,
        address3: rawUser.contact.address3 ? rawUser.contact.address3 : null,
        city: rawUser.contact.city,
        country: rawUser.contact.country,
        countryType: rawUser.contact.countryType,
        phone: formatPhoneNumber(rawUser.contact.phone),
        postalCode: rawUser.contact.postalCode,
        state: rawUser.contact.state,
      };
    }
    if (this.role === ROLES.judge || this.role === ROLES.legacyJudge) {
      this.judgeFullName = rawUser.judgeFullName;
      this.judgeTitle = rawUser.judgeTitle;
    }

    this.section = rawUser.section;
  }

  static USER_CONTACT_VALIDATION_RULES = {
    address1: JoiValidationConstants.STRING.max(100).required(),
    address2: JoiValidationConstants.STRING.max(100).optional().allow(null),
    address3: JoiValidationConstants.STRING.max(100).optional().allow(null),
    city: JoiValidationConstants.STRING.max(100).required(),
    country: JoiValidationConstants.STRING.when('countryType', {
      is: COUNTRY_TYPES.INTERNATIONAL,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    countryType: JoiValidationConstants.STRING.valid(
      COUNTRY_TYPES.DOMESTIC,
      COUNTRY_TYPES.INTERNATIONAL,
    ).required(),
    phone: JoiValidationConstants.STRING.max(100).required(),
    postalCode: joi.when('countryType', {
      is: COUNTRY_TYPES.INTERNATIONAL,
      otherwise: JoiValidationConstants.US_POSTAL_CODE.required(),
      then: JoiValidationConstants.STRING.max(100).required(),
    }),
    state: JoiValidationConstants.STRING.when('countryType', {
      is: COUNTRY_TYPES.INTERNATIONAL,
      otherwise: joi
        .valid(
          ...Object.keys(US_STATES),
          ...Object.keys(US_STATES_OTHER),
          STATE_NOT_AVAILABLE,
        )
        .required(),
      then: joi.optional().allow(null),
    }),
  };

  static BASE_USER_VALIDATION = {
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
    name: JoiValidationConstants.STRING.max(100).required(),
    role: JoiValidationConstants.STRING.valid(
      ...Object.values(ROLES),
    ).required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    address1: 'Enter mailing address',
    city: 'Enter city',
    country: 'Enter a country',
    countryType: 'Enter country type',
    name: 'Enter name',
    phone: 'Enter phone number',
    postalCode: [
      {
        contains: 'match',
        message: 'Enter ZIP code',
      },
      'Enter ZIP code',
    ],
    state: 'Enter state',
  };

  isChambersUser() {
    return this.section && this.section.includes('Chambers');
  }

  static isExternalUser(role) {
    const externalRoles = [
      ROLES.petitioner,
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
      ROLES.irsSuperuser,
    ];
    return externalRoles.includes(role);
  }

  static isInternalUser(role) {
    const internalRoles = [
      ROLES.adc,
      ROLES.admissionsClerk,
      ROLES.chambers,
      ROLES.clerkOfCourt,
      ROLES.caseServicesSupervisor,
      ROLES.docketClerk,
      ROLES.floater,
      ROLES.general,
      ROLES.judge,
      ROLES.petitionsClerk,
      ROLES.reportersOffice,
      ROLES.trialClerk,
    ];
    return internalRoles.includes(role);
  }

  static isCaseServicesUser({ section }) {
    return section === CASE_SERVICES_SUPERVISOR_SECTION;
  }

  getValidationRules() {
    return {
      ...User.BASE_USER_VALIDATION,
      contact: joi.object().keys(User.USER_CONTACT_VALIDATION_RULES).optional(),
      email: JoiValidationConstants.EMAIL.optional(),
      entityName: JoiValidationConstants.STRING.valid('User').required(),
      isUpdatingInformation: joi
        .boolean()
        .optional()
        .description(
          'Whether the contact information for the user is being updated.',
        ),
      pendingEmail: JoiValidationConstants.EMAIL.allow(null).optional(),
      pendingEmailVerificationToken:
        JoiValidationConstants.UUID.allow(null).optional(),
      section: JoiValidationConstants.STRING.optional(),
      token: JoiValidationConstants.STRING.optional(),
      userId: JoiValidationConstants.UUID.required(),
    };
  }

  getErrorToMessageMap() {
    return User.VALIDATION_ERROR_MESSAGES;
  }
}

export const { USER_CONTACT_VALIDATION_RULES, VALIDATION_ERROR_MESSAGES } =
  User;

declare global {
  type RawUser = ExcludeMethods<User>;
}
