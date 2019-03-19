const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

/**
 *
 * @param rawMessage
 * @constructor
 */
function ForwardMessage(rawMessage) {
  Object.assign(this, rawMessage);
}

joiValidationDecorator(
  ForwardMessage,
  joi.object().keys({
    forwardMessage: joi.string().required(),
    forwardRecipientId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
  }),
  undefined,
  {
    forwardMessage: 'Message is a required field.',
    forwardRecipientId: 'Send To is a required field.',
  },
);

module.exports = ForwardMessage;
