const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

const userDecorator = (obj, rawObj) => {
  obj.barNumber = rawObj.barNumber;
  obj.email = rawObj.email;
  obj.name = rawObj.name;
  obj.role = rawObj.role || 'petitioner';
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
  token: joi.string().optional(),
  userId: joi.string().required(),
};

const validationErrorMap = {
  address1: 'Enter mailing address',
  city: 'Enter city',
  country: 'Country is a required field.',
  countryType: 'Country Type is a required field.',
  name: 'Name is a required field.',
  phone: 'Enter phone number',
  postalCode: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
    'Enter zip code',
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
  validationErrorMap,
);

User.ROLES = {
  EXTERNAL: ['petitioner', 'practitioner', 'respondent'],
  INTERNAL: ['docketclerk', 'judge', 'petitionsclerk', 'seniorattorney'],
};

User.prototype.isExternalUser = function() {
  return User.ROLES.EXTERNAL.includes(this.role);
};

User.prototype.isInternalUser = function() {
  return User.ROLES.INTERNAL.includes(this.role);
};

module.exports = { User, userDecorator, userValidation, validationErrorMap };
