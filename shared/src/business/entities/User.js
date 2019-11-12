const joi = require('joi-browser');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

User.ROLES = {
  adc: 'adc',
  admissionsClerk: 'admissionsclerk',
  calendarClerk: 'calendarclerk',
  chambers: 'chambers',
  clerkOfCourt: 'clerkofcourt',
  docketClerk: 'docketclerk',
  judge: 'judge',
  petitioner: 'petitioner',
  petitionsClerk: 'petitionsclerk',
  practitioner: 'practitioner',
  respondent: 'respondent',
  trialClerk: 'trialclerk',
};

const userDecorator = (obj, rawObj) => {
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
};

const userValidation = {
  barNumber: joi.string().optional(),
  contact: joi
    .object()
    .keys({
      address1: joi.string().required(),
      address2: joi
        .string()
        .optional()
        .allow(null),
      address3: joi
        .string()
        .optional()
        .allow(null),
      city: joi.string().required(),
      country: joi.when('countryType', {
        is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
        otherwise: joi
          .string()
          .optional()
          .allow(null),
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
        then: joi
          .string()
          .optional()
          .allow(null),
      }),
    })
    .optional(),
  email: joi.string().optional(),
  name: joi.string().optional(),
  role: joi
    .string()
    .valid(Object.values(User.ROLES))
    .required(),
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
  undefined,
  VALIDATION_ERROR_MESSAGES,
);

User.isExternalUser = function(role) {
  const externalRoles = [
    User.ROLES.petitioner,
    User.ROLES.practitioner,
    User.ROLES.respondent,
  ];
  return externalRoles.includes(role);
};

User.isInternalUser = function(role) {
  const internalRoles = [
    User.ROLES.adc,
    User.ROLES.admissionsClerk,
    User.ROLES.calendarClerk,
    User.ROLES.chambers,
    User.ROLES.clerkOfCourt,
    User.ROLES.docketClerk,
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
