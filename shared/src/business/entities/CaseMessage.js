const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { getTimestampSchema } = require('../../utilities/dateSchema');
const joiStrictTimestamp = getTimestampSchema();

/**
 * constructor
 *
 * @param {object} rawMessage the raw message data
 * @constructor
 */
function CaseMessage(rawMessage, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'CaseMessage';

  this.caseId = rawMessage.caseId;
  this.createdAt = rawMessage.createdAt || createISODateString();
  this.from = rawMessage.from;
  this.fromSection = rawMessage.fromSection;
  this.fromUserId = rawMessage.fromUserId;
  this.message = rawMessage.message;
  this.messageId = rawMessage.messageId || applicationContext.getUniqueId();
  this.subject = rawMessage.subject;
  this.to = rawMessage.to;
  this.toSection = rawMessage.toSection;
  this.toUserId = rawMessage.toUserId;
}

CaseMessage.validationName = 'CaseMessage';

joiValidationDecorator(
  CaseMessage,
  joi.object().keys({
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    createdAt: joiStrictTimestamp.required(),
    entityName: joi.string().valid('CaseMessage').required(),
    from: joi.string().max(100).required(),
    fromSection: joi.string().max(100).required(), //todo valid sections
    fromUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    message: joi.string().max(500).required(),
    messageId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    subject: joi.string().max(100).required(),
    to: joi.string().max(100).optional().allow(null),
    toSection: joi.string().max(100).optional(), //todo valid sections
    toUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
  }),
);

module.exports = { CaseMessage };
