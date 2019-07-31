const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getSectionForRole } = require('./WorkQueue');

/**
 * constructor
 * @param rawUser
 * @constructor
 */
function User(rawUser) {
  this.email = rawUser.email;
  this.addressLine1 = rawUser.addressLine1;
  this.addressLine2 = rawUser.addressLine2;
  this.barnumber = rawUser.barnumber;
  this.phone = rawUser.phone;
  this.name = rawUser.name;
  this.role = rawUser.role || 'petitioner';
  this.section = getSectionForRole(this.role);
  this.token = rawUser.token;
  this.userId = rawUser.userId;
}

joiValidationDecorator(
  User,
  joi.object().keys({
    addressLine1: joi.string().optional(),
    addressLine2: joi.string().optional(),
    barnumber: joi.string().optional(),
    email: joi.string().optional(),
    name: joi.string().optional(),
    phone: joi.string().optional(),
    token: joi.string().optional(),
    userId: joi.string().required(),
  }),
);

User.prototype.isExternalUser = function() {
  return (
    this.role === 'petitioner' ||
    this.role === 'practitioner' ||
    this.role === 'respondent'
  );
};

User.prototype.isInternalUser = function() {
  return !this.isExternalUser();
};

module.exports = { User };
