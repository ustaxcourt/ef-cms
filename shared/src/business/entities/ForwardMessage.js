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
    assigneeId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    forwardMessage: joi.string().required(),
  }),
  undefined,
  {
    assigneeId: 'Send To is a required field.',
    forwardMessage: 'Message is a required field.',
  },
);

module.exports = ForwardMessage;
