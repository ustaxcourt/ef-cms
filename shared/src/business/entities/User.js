const { getSectionForRole } = require('./WorkQueue');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

joiValidationDecorator(
  User,
  joi.object().keys({
    userId: joi.string().required(),
    token: joi.string().optional(),
    name: joi.string().optional(),
    email: joi.string().optional(),
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

module.exports = User;
