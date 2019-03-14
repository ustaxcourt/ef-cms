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
    assigneeId: 'Recipient is a required field.',
    message: 'Message is a required field.',
    section: 'Section is a required field.',
  },
);

module.exports.InitialWorkItemMessage = InitialWorkItemMessage;
