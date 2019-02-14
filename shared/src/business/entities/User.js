const { UnknownUserError } = require('../../errors/errors');

const { getSectionForRole } = require('./WorkQueue');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

joiValidationDecorator(
  User,
  joi.object().keys({
    userId: joi.string().required(),
  }),
);
/**
 * constructor
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);
  this.section = getSectionForRole(this.role);
}

/**
 * isValid
 * @returns {boolean}
 */
User.prototype.isValid = function isValid() {
  return !!this.userId && !!this.role;
};

User.prototype.getDocketRecordName = function getDocketRecordName() {
  return this.role === 'petitioner' ? `Petitioner ${this.name}` : this.name;
};

module.exports = User;
