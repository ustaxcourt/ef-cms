const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { JoiValidationConstants } = require('./JoiValidationConstants');
/**
 * constructor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.rawUpdateUserEmail the raw UpdateUserEmail data
 * @constructor
 */
function UpdateUserEmail() {
  this.entityName = 'UpdateUserEmail';
}

UpdateUserEmail.prototype.init = function init(rawUpdateUserEmail) {
  this.email = rawUpdateUserEmail.email;
  this.confirmEmail = rawUpdateUserEmail.confirmEmail;
};

UpdateUserEmail.VALIDATION_ERROR_MESSAGES = {
  confirmEmail: [
    {
      contains: 'must be [ref:email]',
      message: 'Email addresses do not match',
    },
    { contains: 'is required', message: 'Enter a valid email address' },
    { contains: 'must be a valid', message: 'Enter a valid email address' },
  ],
  email: 'Enter a valid email address',
};

UpdateUserEmail.schema = joi.object().keys({
  confirmEmail: JoiValidationConstants.EMAIL.valid(joi.ref('email')).required(),
  email: JoiValidationConstants.EMAIL.required(),
});

joiValidationDecorator(
  UpdateUserEmail,
  UpdateUserEmail.schema,
  UpdateUserEmail.VALIDATION_ERROR_MESSAGES,
);

module.exports = { UpdateUserEmail: validEntityDecorator(UpdateUserEmail) };
