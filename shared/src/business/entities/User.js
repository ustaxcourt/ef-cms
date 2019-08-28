const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function User(rawUser) {
  this.barNumber = rawUser.barNumber;
  this.email = rawUser.email;
  this.name = rawUser.name;
  this.role = rawUser.role || 'petitioner';
  this.section = rawUser.section;
  this.token = rawUser.token;
  this.userId = rawUser.userId;
  if (rawUser.contact) {
    this.contact = {
      address1: rawUser.contact.address1,
      address2: rawUser.contact.address2,
      address3: rawUser.contact.address3,
      city: rawUser.contact.city,
      country: rawUser.contact.country,
      countryType: rawUser.contact.countryType,
      phone: rawUser.contact.phone,
      postalCode: rawUser.contact.postalCode,
      state: rawUser.contact.state,
    };
  }
}

joiValidationDecorator(
  User,
  joi.object().keys({
    barNumber: joi.string().optional(),
    contact: joi
      .object()
      .keys({
        address1: joi.string().required(),
        address2: joi.string().optional(),
        address3: joi.string().optional(),
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
          otherwise: joi
            .string()
            .regex(/^\d{5}(-\d{4})?$/)
            .required(),
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
  }),
  undefined,
  {
    address1: 'Address is a required field.',
    city: 'City is a required field.',
    country: 'Country is a required field.',
    countryType: 'Country Type is a required field.',
    name: 'Name is a required field.',
    phone: 'Phone is a required field.',
    postalCode: [
      {
        contains: 'match',
        message: 'Please enter a valid zip code.',
      },
      'Zip Code is a required field.',
    ],
    state: 'State is a required field.',
  },
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

module.exports = { User };
