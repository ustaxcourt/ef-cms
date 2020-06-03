const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function NewCaseMessage(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'NewCaseMessage';

  this.message = rawMessage.message;
  this.subject = rawMessage.subject;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
}

NewCaseMessage.validationName = 'NewCaseMessage';

NewCaseMessage.VALIDATION_ERROR_MESSAGES = {
  message: 'Enter a message',
  subject: 'Enter a subject line',
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

joiValidationDecorator(
  NewCaseMessage,
  joi.object().keys({
    entityName: joi.string().valid('NewCaseMessage').required(),
    message: joi.string().max(500).required(),
    subject: joi.string().max(250).required(),
    toSection: joi.string().max(100).required(), //todo valid sections
    toUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required()
      .allow(null),
  }),
  NewCaseMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { NewCaseMessage };
