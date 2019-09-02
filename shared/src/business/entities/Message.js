const joi = require('joi-browser');
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
    createdAt: joi
      .date()
      .iso()
      .optional(),
    from: joi.string().required(),
    fromUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    message: joi.string().required(),
    messageId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    to: joi
      .string()
      .optional()
      .allow(null),
    toUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
  }),
);

module.exports = { Message };
