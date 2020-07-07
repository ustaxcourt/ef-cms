const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CHAMBERS_SECTIONS, SECTIONS } = require('./EntityConstants');

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
    assigneeId: JoiValidationConstants.UUID.required(),
    message: joi.string().max(500).required(),
    section: joi
      .string()
      .valid(...SECTIONS, ...CHAMBERS_SECTIONS)
      .required(),
  }),
  InitialWorkItemMessage.VALIDATION_ERROR_MESSAGES,
);

module.exports = { InitialWorkItemMessage };
