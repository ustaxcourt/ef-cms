import { CASE_STATUS_TYPES } from './EntityConstants';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
export class Message extends JoiValidationEntity {
  public attachments: {
    documentId: string;
  }[];
  public caseStatus: string;
  public caseTitle: string;
  public completedAt: string;
  public completedBy: string;
  public completedBySection: string;
  public completedByUserId: string;
  public completedMessage: string;
  public createdAt: string;
  public leadDocketNumber: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public from: string;
  public fromSection: string;
  public fromUserId: string;
  public isCompleted: boolean;
  public isRead: string;
  public isRepliedTo: boolean;
  public message: string;
  public messageId: string;
  public parentMessageId: string;
  public subject: string;
  public to: string;
  public toSection: string;
  public toUserId: string;

  constructor(rawMessage, { applicationContext }) {
    super('Message');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.attachments = (rawMessage.attachments || []).map(attachment => ({
      documentId: attachment.documentId,
    }));
    this.caseStatus = rawMessage.caseStatus;
    this.caseTitle = rawMessage.caseTitle;
    this.completedAt = rawMessage.completedAt;
    this.completedBy = rawMessage.completedBy;
    this.completedBySection = rawMessage.completedBySection;
    this.completedByUserId = rawMessage.completedByUserId;
    this.completedMessage = rawMessage.completedMessage;
    this.createdAt = rawMessage.createdAt || createISODateString();
    this.leadDocketNumber = rawMessage.leadDocketNumber;
    this.docketNumber = rawMessage.docketNumber;
    this.docketNumberWithSuffix = rawMessage.docketNumberWithSuffix;
    this.from = rawMessage.from;
    this.fromSection = rawMessage.fromSection;
    this.fromUserId = rawMessage.fromUserId;
    this.isCompleted = rawMessage.isCompleted || false;
    this.isRead = rawMessage.isRead || false;
    this.isRepliedTo = rawMessage.isRepliedTo || false;
    this.message = rawMessage.message;
    this.messageId = rawMessage.messageId || applicationContext.getUniqueId();
    this.parentMessageId = rawMessage.parentMessageId || this.messageId;
    this.subject = rawMessage.subject?.trim();
    this.to = rawMessage.to;
    this.toSection = rawMessage.toSection;
    this.toUserId = rawMessage.toUserId;
  }

  static VALIDATION_ERROR_MESSAGES = {
    message: [
      { contains: 'is required', message: 'Enter a message' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 700 characters. Enter 700 or fewer characters.',
      },
    ],
    subject: [
      { contains: 'is required', message: 'Enter a subject line' },
      {
        contains: 'is not allowed to be empty',
        message: 'Enter a subject line',
      },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 250 characters. Enter 250 or fewer characters.',
      },
    ],
    toSection: 'Select a section',
    toUserId: 'Select a recipient',
  };

  static VALIDATION_RULES = {
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
      .description(
        'Array of document metadata objects attached to the message.',
      ),
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

  /**
   * marks the message as completed by the user at the current time
   *
   * @param {string} message the message provided when completing the thread
   * @param {object} user the user who completed the thread
   * @returns {Message} the updated message
   */
  markAsCompleted({ message, user }) {
    this.isCompleted = true;
    this.completedAt = createISODateString();
    this.isRepliedTo = true;
    this.completedBy = user.name;
    this.completedByUserId = user.userId;
    this.completedBySection = user.section;
    this.completedMessage = message || null;

    return this;
  }

  /**
   * adds the attachment to the attachments array on the message
   *
   * @param {object} attachmentToAdd the attachment to add to the message
   * @returns {Message} the updated message
   */

  addAttachment(attachmentToAdd) {
    this.attachments.push(attachmentToAdd);

    return this;
  }

  getErrorToMessageMap() {
    return Message.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return Message.VALIDATION_RULES;
  }
}

declare global {
  type RawMessage = ExcludeMethods<Message>;
}
