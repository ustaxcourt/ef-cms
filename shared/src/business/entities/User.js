const joi = require('joi');
const {
  COUNTRY_TYPES,
  ROLES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function User() {
  this.entityName = 'User';
}

User.prototype.init = function init(rawUser, { filtered = false } = {}) {
  userDecorator(this, rawUser, filtered);
  this.section = rawUser.section;
};

const userDecorator = (obj, rawObj, filtered = false) => {
  if (!filtered) {
    obj.pendingEmailVerificationToken = rawObj.pendingEmailVerificationToken;
  }

  obj.email = rawObj.email;
  obj.name = rawObj.name;
  obj.pendingEmail = rawObj.pendingEmail;
  obj.role = rawObj.role || ROLES.petitioner;
  obj.token = rawObj.token;
  obj.userId = rawObj.userId;
  obj.isUpdatingInformation = rawObj.isUpdatingInformation;
  if (rawObj.contact) {
    obj.contact = {
      address1: rawObj.contact.address1,
      address2: rawObj.contact.address2 ? rawObj.contact.address2 : null,
      address3: rawObj.contact.address3 ? rawObj.contact.address3 : null,
      city: rawObj.contact.city,
      country: rawObj.contact.country,
      countryType: rawObj.contact.countryType,
      phone: rawObj.contact.phone,
      postalCode: rawObj.contact.postalCode,
      state: rawObj.contact.state,
    };
  }
  if (obj.role === ROLES.judge || obj.role === ROLES.legacyJudge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

const USER_CONTACT_VALIDATION_RULES = {
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
  state: JoiValidationConstants.STRING.valid(
    ...Object.keys(US_STATES),
    ...US_STATES_OTHER,
    STATE_NOT_AVAILABLE,
  ).when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: joi.required(),
    then: joi.optional().allow(null),
  }),
};

const baseUserValidation = {
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
  role: JoiValidationConstants.STRING.valid(...Object.values(ROLES)).required(),
};

const userValidation = {
  ...baseUserValidation,
  contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
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

const VALIDATION_ERROR_MESSAGES = {
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

joiValidationDecorator(
  User,
  joi.object().keys(userValidation),
  VALIDATION_ERROR_MESSAGES,
);

User.isExternalUser = function (role) {
  const externalRoles = [
    ROLES.petitioner,
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.irsSuperuser,
  ];
  return externalRoles.includes(role);
};

User.isInternalUser = function (role) {
  const internalRoles = [
    ROLES.adc,
    ROLES.admissionsClerk,
    ROLES.chambers,
    ROLES.clerkOfCourt,
    ROLES.docketClerk,
    ROLES.floater,
    ROLES.general,
    ROLES.judge,
    ROLES.petitionsClerk,
    ROLES.reportersOffice,
    ROLES.trialClerk,
  ];
  return internalRoles.includes(role);
};

module.exports = {
  USER_CONTACT_VALIDATION_RULES,
  User: validEntityDecorator(User),
  VALIDATION_ERROR_MESSAGES,
  baseUserValidation,
  userDecorator,
  userValidation,
};
