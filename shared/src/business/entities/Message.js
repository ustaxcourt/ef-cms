const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};
const uuid = require('uuid');

/**
 * constructor
 * @param rawMessage
 * @constructor
 */
function Message(rawMessage) {
  Object.assign(this, rawMessage, {
    createdAt: rawMessage.createdAt || new Date().toISOString(),
    messageId: rawMessage.messageId || uuid.v4(),
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
      .uuid(uuidVersions)
      .required(),
    message: joi.string().required(),
    messageId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    to: joi
      .string()
      .optional()
      .allow(null),
    toUserId: joi
      .string()
      .uuid(uuidVersions)
      .optional()
      .allow(null),
  }),
);

module.exports = { Message };
