const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { CASE_STATUS_TYPES } = require('./EntityConstants');
const { createISODateString } = require('../utilities/DateHandler');
const { JoiValidationConstants } = require('./JoiValidationConstants');
/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function Message() {
  this.entityName = 'Message';
}

Message.prototype.init = function init(rawMessage, { applicationContext }) {
  messageDecorator(this, rawMessage, { applicationContext });
};

const messageDecorator = (
  messageEntity,
  rawMessage,
  { applicationContext },
) => {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  messageEntity.attachments = (rawMessage.attachments || []).map(
    attachment => ({
      documentId: attachment.documentId,
    }),
  );
  messageEntity.caseStatus = rawMessage.caseStatus;
  messageEntity.caseTitle = rawMessage.caseTitle;
  messageEntity.completedAt = rawMessage.completedAt;
  messageEntity.completedBy = rawMessage.completedBy;
  messageEntity.completedBySection = rawMessage.completedBySection;
  messageEntity.completedByUserId = rawMessage.completedByUserId;
  messageEntity.completedMessage = rawMessage.completedMessage;
  messageEntity.createdAt = rawMessage.createdAt || createISODateString();
  messageEntity.leadDocketNumber = rawMessage.leadDocketNumber;
  messageEntity.docketNumber = rawMessage.docketNumber;
  messageEntity.docketNumberWithSuffix = rawMessage.docketNumberWithSuffix;
  messageEntity.from = rawMessage.from;
  messageEntity.fromSection = rawMessage.fromSection;
  messageEntity.fromUserId = rawMessage.fromUserId;
  messageEntity.isCompleted = rawMessage.isCompleted || false;
  messageEntity.isRead = rawMessage.isRead || false;
  messageEntity.isRepliedTo = rawMessage.isRepliedTo || false;
  messageEntity.message = rawMessage.message;
  messageEntity.messageId =
    rawMessage.messageId || applicationContext.getUniqueId();
  messageEntity.parentMessageId =
    rawMessage.parentMessageId || messageEntity.messageId;
  messageEntity.subject = rawMessage.subject;
  messageEntity.to = rawMessage.to;
  messageEntity.toSection = rawMessage.toSection;
  messageEntity.toUserId = rawMessage.toUserId;
};

Message.VALIDATION_ERROR_MESSAGES = {
  message: [
    { contains: 'is required', message: 'Enter a message' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 700 characters. Enter 700 or fewer characters.',
    },
  ],
  subject: [
    { contains: 'is required', message: 'Enter a subject line' },
    { contains: 'is not allowed to be empty', message: 'Enter a subject line' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 250 characters. Enter 250 or fewer characters.',
    },
  ],
  toSection: 'Select a section',
  toUserId: 'Select a recipient',
};

Message.VALIDATION_RULES = {
  attachments: joi
    .array()
    .items(
      joi.object().keys({
        documentId: JoiValidationConstants.UUID.required().description(
          'ID of the document attached; can be either a docketEntryId or correspondenceId depending on the type of document.',
        ),
        documentTitle: JoiValidationConstants.STRING.max(500).optional(),
      }),
    )
    .optional()
    .description('Array of document metadata objects attached to the message.'),
  caseStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(CASE_STATUS_TYPES),
  )
    .required()
    .description('The status of the associated case.'),
  caseTitle: JoiValidationConstants.STRING.required().description(
    'The case title for the associated cases.',
  ),
  completedAt: JoiValidationConstants.ISO_DATE.when('isCompleted', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }).description('When the message was marked as completed.'),
  completedBy: JoiValidationConstants.STRING.max(500)
    .when('isCompleted', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('The name of the user who completed the message thread'),
  completedBySection: JoiValidationConstants.STRING.when('isCompleted', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }).description('The section of the user who completed the message thread'),
  completedByUserId: JoiValidationConstants.UUID.when('isCompleted', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }).description('The ID of the user who completed the message thread'),
  completedMessage: JoiValidationConstants.STRING.max(500)
    .allow(null)
    .optional()
    .description('The message entered when completing the message thread.'),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the message was created.',
  ),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.max(20)
    .required()
    .description('The docket number and suffix for the associated case.'),
  entityName: JoiValidationConstants.STRING.valid('Message').required(),
  from: JoiValidationConstants.STRING.max(100)
    .required()
    .description('The name of the user who sent the message.'),
  fromSection: JoiValidationConstants.STRING.required().description(
    'The section of the user who sent the message.',
  ),
  fromUserId: JoiValidationConstants.UUID.required().description(
    'The ID of the user who sent the message.',
  ),
  isCompleted: joi
    .boolean()
    .required()
    .description('Whether the message thread has been completed.'),
  isRead: joi.boolean().required(),
  isRepliedTo: joi
    .boolean()
    .required()
    .description('Whether the message has been replied to or forwarded.'),
  leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
  message: JoiValidationConstants.STRING.max(700)
    .required()
    .description('The message text.'),
  messageId: JoiValidationConstants.UUID.required().description(
    'A unique ID generated by the system to represent the message.',
  ),
  parentMessageId: JoiValidationConstants.UUID.required().description(
    'The ID of the initial message in the thread.',
  ),
  subject: JoiValidationConstants.STRING.max(250)
    .required()
    .description('The subject line of the message.'),
  to: JoiValidationConstants.STRING.max(100)
    .required()
    .allow(null)
    .description('The name of the user who is the recipient of the message.'),
  toSection: JoiValidationConstants.STRING.required().description(
    'The section of the user who is the recipient of the message.',
  ),
  toUserId: JoiValidationConstants.UUID.required()
    .allow(null)
    .description('The ID of the user who is the recipient of the message.'),
};

joiValidationDecorator(
  Message,
  joi.object().keys(Message.VALIDATION_RULES),
  Message.VALIDATION_ERROR_MESSAGES,
);

/**
 * marks the message as completed by the user at the current time
 *
 * @param {string} message the message provided when completing the thread
 * @param {object} user the user who completed the thread
 * @returns {Message} the updated message
 */
Message.prototype.markAsCompleted = function ({ message, user }) {
  this.isCompleted = true;
  this.completedAt = createISODateString();
  this.isRepliedTo = true;
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedBySection = user.section;
  this.completedMessage = message || null;

  return this;
};

/**
 * adds the attachment to the attachments array on the message
 *
 * @param {object} attachmentToAdd the attachment to add to the message
 * @returns {Message} the updated message
 */
Message.prototype.addAttachment = function (attachmentToAdd) {
  this.attachments.push(attachmentToAdd);

  return this;
};

module.exports = {
  Message: validEntityDecorator(Message),
  messageDecorator,
};
