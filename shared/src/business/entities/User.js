const { getSectionForRole } = require('./WorkQueue');

const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

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
 * @param user
 * @constructor
 */
function User(user) {
  Object.assign(this, user);
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

module.exports = { User };
