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
    messageId: rawMessage.messageId || uuid.v4(),
    createdAt: rawMessage.createdAt || new Date().toISOString(),
  });
}

joiValidationDecorator(
  Message,
  joi.object().keys({
    messageId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    message: joi.string().required(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .optional(),
    sentBy: joi.string().required(),
    sentTo: joi
      .string()
      .allow(null)
      .optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
  }),
);

module.exports = Message;
