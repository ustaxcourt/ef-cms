const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

InitialWorkItemMessage.VALIDATION_ERROR_MESSAGES = {
  assigneeId: 'Select a recipient',
  message: 'Enter a message',
  section: 'Select a section',
};

/**
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function InitialWorkItemMessage(rawMessage) {
  this.assigneeId = rawMessage.assigneeId;
  this.message = rawMessage.message;
  this.section = rawMessage.section;
}

joiValidationDecorator(
  InitialWorkItemMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    message: joi.string().required(),
    section: joi.string().required(),
  }),
  undefined,
  InitialWorkItemMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { InitialWorkItemMessage };
