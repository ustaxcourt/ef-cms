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
  this.name = rawUser.name;
  this.role = rawUser.role || 'petitioner';
  this.section = getSectionForRole(this.role);
  this.token = rawUser.token;
  this.userId = rawUser.userId;
}

joiValidationDecorator(
  User,
  joi.object().keys({
    email: joi.string().optional(),
    name: joi.string().optional(),
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
