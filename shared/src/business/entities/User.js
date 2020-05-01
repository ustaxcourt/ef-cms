const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

User.ROLES = {
  adc: 'adc',
  admin: 'admin',
  admissionsClerk: 'admissionsclerk',
  chambers: 'chambers',
  clerkOfCourt: 'clerkofcourt',
  docketClerk: 'docketclerk',
  floater: 'floater',
  inactivePractitioner: 'inactivePractitioner',
  irsPractitioner: 'irsPractitioner',
  irsSuperuser: 'irsSuperuser',
  judge: 'judge',
  petitioner: 'petitioner',
  petitionsClerk: 'petitionsclerk',
  privatePractitioner: 'privatePractitioner',
  trialClerk: 'trialclerk',
};

const userDecorator = (obj, rawObj) => {
  obj.entityName = 'User';
  obj.barNumber = rawObj.barNumber;
  obj.email = rawObj.email;
  obj.name = rawObj.name;
  obj.role = rawObj.role || User.ROLES.petitioner;
  obj.section = rawObj.section;
  obj.token = rawObj.token;
  obj.userId = rawObj.userId;
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
  if (obj.role === User.ROLES.judge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

const userValidation = {
  barNumber: joi.string().optional().allow(null),
  contact: joi
    .object()
    .keys({
      address1: joi.string().required(),
      address2: joi.string().optional().allow(null),
      address3: joi.string().optional().allow(null),
      city: joi.string().required(),
      country: joi.when('countryType', {
        is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        otherwise: joi.string().optional().allow(null),
        then: joi.string().required(),
      }),
      countryType: joi
        .string()
        .valid(
          ContactFactory.COUNTRY_TYPES.DOMESTIC,
          ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        )
        .required(),

      phone: joi.string().required(),

      postalCode: joi.when('countryType', {
        is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        otherwise: JoiValidationConstants.US_POSTAL_CODE.required(),
        then: joi.string().required(),
      }),

      state: joi.when('countryType', {
        is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        otherwise: joi.string().required(),
        then: joi.string().optional().allow(null),
      }),
    })
    .optional(),
  email: joi.string().optional(),
  entityName: joi.string().valid('User').required(),
  judgeFullName: joi.when('role', {
    is: User.ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().optional(),
  }),
  judgeTitle: joi.when('role', {
    is: User.ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().optional(),
  }),
  name: joi.string().optional(),
  role: joi
    .string()
    .valid(...Object.values(User.ROLES))
    .required(),
  section: joi.string().optional(),
  token: joi.string().optional(),
  userId: joi.string().required(),
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

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function User(rawUser) {
  userDecorator(this, rawUser);
}

User.validationName = 'User';

joiValidationDecorator(
  User,
  joi.object().keys(userValidation),
  VALIDATION_ERROR_MESSAGES,
);

User.isExternalUser = function (role) {
  const externalRoles = [
    User.ROLES.petitioner,
    User.ROLES.privatePractitioner,
    User.ROLES.irsPractitioner,
    User.ROLES.irsSuperuser,
  ];
  return externalRoles.includes(role);
};

User.isInternalUser = function (role) {
  const internalRoles = [
    User.ROLES.adc,
    User.ROLES.admissionsClerk,
    User.ROLES.chambers,
    User.ROLES.clerkOfCourt,
    User.ROLES.docketClerk,
    User.ROLES.floater,
    User.ROLES.judge,
    User.ROLES.petitionsClerk,
    User.ROLES.trialClerk,
  ];
  return internalRoles.includes(role);
};

module.exports = {
  User,
  VALIDATION_ERROR_MESSAGES,
  userDecorator,
  userValidation,
};
