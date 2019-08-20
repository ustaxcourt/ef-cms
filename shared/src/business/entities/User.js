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
  this.email = rawUser.email;
  this.addressLine1 = rawUser.addressLine1;
  this.addressLine2 = rawUser.addressLine2;
  this.barNumber = rawUser.barNumber;
  this.phone = rawUser.phone;
  this.name = rawUser.name;
  this.role = rawUser.role || 'petitioner';
  this.section = rawUser.section;
  this.token = rawUser.token;
  this.userId = rawUser.userId;
}

joiValidationDecorator(
  User,
  joi.object().keys({
    addressLine1: joi.string().optional(),
    addressLine2: joi.string().optional(),
    barNumber: joi.string().optional(),
    email: joi.string().optional(),
    name: joi.string().optional(),
    phone: joi.string().optional(),
    token: joi.string().optional(),
    userId: joi.string().required(),
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
