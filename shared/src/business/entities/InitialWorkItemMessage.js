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
function InitialWorkItemMessage(rawMessage) {
  Object.assign(this, rawMessage);
}

joiValidationDecorator(
  InitialWorkItemMessage,
  joi.object().keys({
    assigneeId: joi
      .string()
      .uuid(uuidVersions)
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
