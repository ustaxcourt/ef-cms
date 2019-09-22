const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

ForwardMessage.VALIDATION_ERROR_MESSAGES = {
  assigneeId: 'Select a recipient',
  forwardMessage: 'Enter a message',
  section: 'Select a section',
};

/**
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function ForwardMessage(rawMessage) {
  this.assigneeId = rawMessage.assigneeId;
  this.forwardMessage = rawMessage.forwardMessage;
  this.section = rawMessage.section;
}

joiValidationDecorator(
  ForwardMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    forwardMessage: joi.string().required(),
    section: joi.string().required(),
  }),
  undefined,
  ForwardMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ForwardMessage };
