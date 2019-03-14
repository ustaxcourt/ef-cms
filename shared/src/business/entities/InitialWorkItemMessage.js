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
    message: joi.string().required(),
    recipientId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    section: joi.string().required(),
  }),
  undefined,
  {
    message: 'Message is a required field.',
    recipientId: 'Recipient is a required field.',
    section: 'Section is a required field.',
  },
);

module.exports.InitialWorkItemMessage = InitialWorkItemMessage;
