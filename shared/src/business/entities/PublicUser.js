const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { baseUserValidation: userValidation } = require('./User');
const { ROLES } = require('./EntityConstants');

PublicUser.validationName = 'PublicUser';

const userDecorator = (obj, rawObj) => {
  obj.name = rawObj.name;
  obj.role = rawObj.role;
  if (obj.role === ROLES.judge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

const VALIDATION_ERROR_MESSAGES = {
  role: 'Role is required',
};

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function PublicUser(rawUser) {
  userDecorator(this, rawUser);
}

joiValidationDecorator(
  PublicUser,
  joi.object().keys(userValidation),
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  PublicUser,
  VALIDATION_ERROR_MESSAGES,
  userDecorator,
  userValidation,
};
