const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  userDecorator,
  userValidation,
  VALIDATION_ERROR_MESSAGES: USER_VALIDATION_ERROR_MESSAGES,
} = require('./User');

const entityName = 'UpdateUser';

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function UpdateUser() {
  this.entityName = entityName;
}

UpdateUser.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
};

const VALIDATION_ERROR_MESSAGES = {
  ...USER_VALIDATION_ERROR_MESSAGES,
  email: 'Enter a valid email address',
};

const updateUserValidation = {
  ...userValidation,
  email: JoiValidationConstants.EMAIL.required(),
  entityName: JoiValidationConstants.STRING.valid(entityName).required(),
};

joiValidationDecorator(
  UpdateUser,
  joi.object().keys({
    ...updateUserValidation,
  }),
  VALIDATION_ERROR_MESSAGES,
);

UpdateUser.validationName = 'UpdateUser';

UpdateUser.validationRules = updateUserValidation;

UpdateUser.VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

module.exports = {
  UpdateUser: validEntityDecorator(UpdateUser),
  entityName,
};
