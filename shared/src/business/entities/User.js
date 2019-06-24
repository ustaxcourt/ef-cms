const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getSectionForRole } = require('./WorkQueue');

joiValidationDecorator(
  User,
  joi.object().keys({
    email: joi.string().optional(),
    name: joi.string().optional(),
    token: joi.string().optional(),
    userId: joi.string().required(),
  }),
);
/**
 * constructor
 * @param rawUser
 * @constructor
 */
function User(rawUser) {
  Object.assign(this, {
    email: rawUser.email,
    name: rawUser.name,
    role: rawUser.role,
    section: rawUser.section,
    token: rawUser.token,
    userId: rawUser.userId,
  });
  this.section = getSectionForRole(this.role);
  this.role = this.role || 'petitioner';
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

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
