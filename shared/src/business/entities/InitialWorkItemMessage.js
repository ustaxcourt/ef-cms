const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawMessage
 * @constructor
 */
function InitialWorkItemMessage(rawMessage) {
  Object.assign(this, {
    assigneeId: rawMessage.assigneeId,
    message: rawMessage.message,
    section: rawMessage.section,
  });
}

joiValidationDecorator(
  InitialWorkItemMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    message: joi.string().required(),
    section: joi.string().required(),
  }),
  undefined,
  {
    assigneeId: 'Recipient is required.',
    message: 'Message is required.',
    section: 'Section is required.',
  },
);

module.exports = { InitialWorkItemMessage };
