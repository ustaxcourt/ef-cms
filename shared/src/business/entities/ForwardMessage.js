const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawMessage
 * @constructor
 */
function ForwardMessage(rawMessage) {
  Object.assign(this, {
    assigneeId: rawMessage.assigneeId,
    forwardMessage: rawMessage.forwardMessage,
    section: rawMessage.section,
  });
}

joiValidationDecorator(
  ForwardMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
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
