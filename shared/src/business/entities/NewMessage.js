const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { Message } = require('./Message');

/**
 * NewMessage entity - used for validating
 * the Create Message modal form
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function NewMessage() {
  this.entityName = 'NewMessage';
}

NewMessage.prototype.init = function init(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.message = rawMessage.message;
  this.subject = rawMessage.subject;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
};

NewMessage.validationName = 'NewMessage';

NewMessage.VALIDATION_ERROR_MESSAGES = {
  message: 'Enter a message',
  subject: 'Enter a subject line',
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

joiValidationDecorator(
  NewMessage,
  joi.object().keys({
    entityName: JoiValidationConstants.STRING.valid('NewMessage').required(),
    message: Message.VALIDATION_RULES.message,
    subject: Message.VALIDATION_RULES.subject,
    toSection: Message.VALIDATION_RULES.toSection,
    toUserId: Message.VALIDATION_RULES.toUserId,
  }),
  NewMessage.VALIDATION_ERROR_MESSAGES,
);

exports.NewMessage = validEntityDecorator(NewMessage);
