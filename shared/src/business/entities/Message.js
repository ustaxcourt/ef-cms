const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function Message(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'Message';

  this.createdAt = rawMessage.createdAt || createISODateString();
  this.from = rawMessage.from;
  this.fromUserId = rawMessage.fromUserId;
  this.message = rawMessage.message;
  this.messageId = rawMessage.messageId || applicationContext.getUniqueId();
  this.to = rawMessage.to;
  this.toUserId = rawMessage.toUserId;
}

Message.validationName = 'Message';

joiValidationDecorator(
  Message,
  joi.object().keys({
    createdAt: JoiValidationConstants.ISO_DATE.optional(),
    entityName: joi.string().valid('Message').required(),
    from: joi.string().max(100).required(),
    fromUserId: JoiValidationConstants.UUID.required(),
    message: joi.string().max(500).required(),
    messageId: JoiValidationConstants.UUID.required(),
    to: joi.string().max(100).optional().allow(null),
    toUserId: JoiValidationConstants.UUID.optional().allow(null),
  }),
);

module.exports = { Message };
