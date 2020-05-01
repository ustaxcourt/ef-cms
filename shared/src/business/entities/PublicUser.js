const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { User } = require('./User');

PublicUser.validationName = 'PublicUser';

const userDecorator = (obj, rawObj) => {
  obj.name = rawObj.name;
  obj.role = rawObj.role;
  if (obj.role === User.ROLES.judge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

const userValidation = {
  judgeFullName: joi.when('role', {
    is: User.ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().optional(),
  }),
  judgeTitle: joi.when('role', {
    is: User.ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().optional(),
  }),
  name: joi.string().optional(),
  role: joi
    .string()
    .valid(...Object.values(User.ROLES))
    .required(),
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
