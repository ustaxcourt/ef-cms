const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CHAMBERS_SECTIONS, SECTIONS } = require('./EntityConstants');

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
    assigneeId: JoiValidationConstants.UUID.required(),
    forwardMessage: joi.string().max(500).required(),
    section: joi
      .string()
      .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
      .required(),
  }),
  ForwardMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ForwardMessage };
