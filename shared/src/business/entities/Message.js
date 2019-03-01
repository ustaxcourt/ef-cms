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
    message: joi.string().required(),
    messageId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    sentBy: joi.string().required(),
    sentTo: joi
      .string()
      .allow(null)
      .optional(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .optional(),
  }),
);

module.exports = Message;
