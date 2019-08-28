const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

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
    email: joi.string().optional(),
    name: joi.string().optional(),
    token: joi.string().optional(),
    userId: joi.string().required(),
    // TODO: add contact
  }),
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
