const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const { userDecorator, userValidation } = require('./User');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Judge(rawUser) {
  userDecorator(this, rawUser);
  this.judgeTitle = rawUser.judgeTitle;
  this.judgeFullName = rawUser.judgeFullName;
}

joiValidationDecorator(
  Judge,
  joi.object().keys({
    ...userValidation,
    judgeFullName: joi.string().optional(),
    judgeTitle: joi.string().optional(),
  }),
  undefined,
  {},
);

Judge.validationName = 'Judge';

module.exports = { Judge };
