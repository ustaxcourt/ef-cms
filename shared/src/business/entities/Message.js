const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * constructor
 * @param rawMessage
 * @constructor
 */
function Message(rawMessage) {
  Object.assign(this, {
    createdAt: rawMessage.createdAt || new Date().toISOString(),
    from: rawMessage.from,
    fromUserId: rawMessage.fromUserId,
    message: rawMessage.message,
    messageId: rawMessage.messageId || uuid.v4(),
    to: rawMessage.to,
    toUserId: rawMessage.toUserId,
  });
}

Message.name = 'Message';

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
