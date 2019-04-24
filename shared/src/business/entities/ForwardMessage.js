const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

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
    section: joi.string().required(),
  }),
  undefined,
  {
    assigneeId: 'Recipient is required.',
    forwardMessage: 'Message is required.',
    section: 'Section is required',
  },
);

module.exports = { ForwardMessage };
