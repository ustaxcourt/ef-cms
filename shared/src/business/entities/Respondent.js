const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const { ContactFactory } = require('../entities/contacts/ContactFactory');

const respondentDecorator = (obj, rawObj) => {
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

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Respondent(rawUser) {
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
      address2: rawUser.contact.address2 ? rawUser.contact.address2 : null,
      address3: rawUser.contact.address3 ? rawUser.contact.address3 : null,
      city: rawUser.contact.city,
      country: rawUser.contact.country,
      countryType: rawUser.contact.countryType,
      phone: rawUser.contact.phone,
      postalCode: rawUser.contact.postalCode,
      state: rawUser.contact.state,
    };
  }
}

const validationErrorMap = {
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
};

const respondentValidation = {
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

joiValidationDecorator(
  Respondent,
  joi.object().keys(respondentValidation),
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

Respondent.validationName = 'Respondent';

module.exports = {
  Respondent,
  respondentDecorator,
  respondentValidation,
  validationErrorMap,
};
