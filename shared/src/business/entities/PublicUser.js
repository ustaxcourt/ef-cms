const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { baseUserValidation: userValidation } = require('./User');
const { ROLES } = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function PublicUser() {}

PublicUser.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
};

const userDecorator = (obj, rawObj) => {
  obj.name = rawObj.name;
  obj.role = rawObj.role;
  if (obj.role === ROLES.judge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

PublicUser.validationName = 'PublicUser';

const VALIDATION_ERROR_MESSAGES = {
  role: 'Role is required',
};

joiValidationDecorator(
  PublicUser,
  joi.object().keys(userValidation),
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  PublicUser: validEntityDecorator(PublicUser),
  VALIDATION_ERROR_MESSAGES,
  userDecorator,
  userValidation,
};
