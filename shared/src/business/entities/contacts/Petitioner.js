const joi = require('joi');
const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * constructor
 *
 * @param {object} rawUser the raw petitioner data
 * @constructor
 */
function Petitioner() {
  this.entityName = 'Petitioner';
}

Petitioner.prototype.init = function init(rawContact, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.additionalName = rawContact.additionalName;
  this.address1 = rawContact.address1;
  this.address2 = rawContact.address2 || undefined;
  this.address3 = rawContact.address3 || undefined;
  this.city = rawContact.city;
  this.contactId = rawContact.contactId || applicationContext.getUniqueId();
  this.contactType = rawContact.contactType;
  this.country = rawContact.country;
  this.countryType = rawContact.countryType;
  this.email = rawContact.email;
  this.hasEAccess = rawContact.hasEAccess || undefined;
  this.inCareOf = rawContact.inCareOf;
  this.isAddressSealed = rawContact.isAddressSealed || false;
  this.name = rawContact.name;
  this.phone = rawContact.phone;
  this.postalCode = rawContact.postalCode;
  this.sealedAndUnavailable = rawContact.sealedAndUnavailable || false;
  this.secondaryName = rawContact.secondaryName;
  this.serviceIndicator = rawContact.serviceIndicator;
  this.state = rawContact.state;
  this.title = rawContact.title;
};

Petitioner.VALIDATION_RULES = {
  additionalName: JoiValidationConstants.STRING.max(600).optional(),
  address1: JoiValidationConstants.STRING.max(100).required(),
  address2: JoiValidationConstants.STRING.max(100).optional().allow(null),
  address3: JoiValidationConstants.STRING.max(100).optional().allow(null),
  city: JoiValidationConstants.STRING.max(100).required(),
  contactId: JoiValidationConstants.UUID.required().description(
    'Unique contact ID only used by the system.',
  ),
  contactType: JoiValidationConstants.STRING.valid(
    ...Object.values(CONTACT_TYPES),
  ).required(),
  country: JoiValidationConstants.STRING.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.DOMESTIC,
    COUNTRY_TYPES.INTERNATIONAL,
  ).required(),
  email: JoiValidationConstants.EMAIL.when('hasEAccess', {
    is: true,
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  hasEAccess: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the contact has credentials to both the legacy and new system.',
    ),
  inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  isAddressSealed: joi.boolean().required(),
  name: JoiValidationConstants.STRING.max(100).required(),
  phone: JoiValidationConstants.STRING.max(100).required(),
  postalCode: joi.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: JoiValidationConstants.US_POSTAL_CODE.required(),
    then: JoiValidationConstants.STRING.max(100).required(),
  }),
  sealedAndUnavailable: joi.boolean().optional(),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).required(),
  state: JoiValidationConstants.STRING.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: joi
      .valid(...Object.keys(US_STATES), ...US_STATES_OTHER, STATE_NOT_AVAILABLE)
      .required(),
    then: joi.optional().allow(null),
  }),
  title: JoiValidationConstants.STRING.max(100).optional(),
};

Petitioner.VALIDATION_ERROR_MESSAGES = {
  additionalName: [
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 100 characters. Enter 100 or fewer characters.',
    },
  ],
  address1: 'Enter mailing address',
  city: 'Enter city',
  contactType: 'Select a role type',
  contactTypeSecondIntervenor:
    'Only one (1) Intervenor is allowed per case. Please select a different Role.',
  country: 'Enter a country',
  countryType: 'Enter country type',
  name: [
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 100 characters. Enter 100 or fewer characters.',
    },
    'Enter name',
  ],
  phone: 'Enter phone number',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter ZIP code',
    },
    'Enter ZIP code',
  ],
  serviceIndicator: 'Select a service indicator',
  state: 'Enter state',
};

joiValidationDecorator(
  Petitioner,
  joi.object().keys(Petitioner.VALIDATION_RULES),
  Petitioner.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  Petitioner: validEntityDecorator(Petitioner),
};
