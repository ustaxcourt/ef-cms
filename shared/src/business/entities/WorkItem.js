const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { CHIEF_JUDGE } = require('./cases/CaseConstants');
const { createISODateString } = require('../utilities/DateHandler');
const { Message } = require('./Message');
const { omit, orderBy } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawWorkItem the raw work item data
 * @constructor
 */
function WorkItem(rawWorkItem, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.associatedJudge = rawWorkItem.associatedJudge || CHIEF_JUDGE;
  this.assigneeId = rawWorkItem.assigneeId;
  this.assigneeName = rawWorkItem.assigneeName;
  this.caseCaptionNames = rawWorkItem.caseCaptionNames;
  this.caseId = rawWorkItem.caseId;
  this.caseIsInProgress = rawWorkItem.caseIsInProgress;
  this.caseStatus = rawWorkItem.caseStatus;
  this.completedAt = rawWorkItem.completedAt;
  this.completedBy = rawWorkItem.completedBy;
  this.completedByUserId = rawWorkItem.completedByUserId;
  this.completedMessage = rawWorkItem.completedMessage;
  this.createdAt = rawWorkItem.createdAt || createISODateString();
  this.docketNumber = rawWorkItem.docketNumber;
  this.docketNumberSuffix = rawWorkItem.docketNumberSuffix;
  this.document = omit(rawWorkItem.document, 'workItems');
  this.hideFromPendingMessages = rawWorkItem.hideFromPendingMessages;
  this.highPriority = rawWorkItem.highPriority;
  this.inProgress = rawWorkItem.inProgress;
  this.isInitializeCase = rawWorkItem.isInitializeCase;
  this.isQC = rawWorkItem.isQC;
  this.isRead = rawWorkItem.isRead;
  this.section = rawWorkItem.section;
  this.sentBy = rawWorkItem.sentBy;
  this.sentBySection = rawWorkItem.sentBySection;
  this.sentByUserId = rawWorkItem.sentByUserId;
  this.trialDate = rawWorkItem.trialDate;
  this.updatedAt = rawWorkItem.updatedAt || createISODateString();
  this.workItemId = rawWorkItem.workItemId || applicationContext.getUniqueId();
  this.messages = (rawWorkItem.messages || []).map(
    message => new Message(message, { applicationContext }),
  );
}

WorkItem.validationName = 'WorkItem';

joiValidationDecorator(
  WorkItem,
  joi.object().keys({
    assigneeId: joi.string().allow(null).optional(),
    assigneeName: joi.string().allow(null).optional(), // should be a Message entity at some point
    associatedJudge: joi.string().required(),
    caseCaptionNames: joi.string().optional(),
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    caseIsInProgress: joi.boolean().optional(),
    caseStatus: joi.string().optional(),
    completedAt: joi.date().iso().optional(),
    completedBy: joi.string().optional().allow(null),
    completedByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
    completedMessage: joi.string().optional().allow(null),
    createdAt: joi.date().iso().optional(),
    docketNumber: joi.string().required(),
    docketNumberSuffix: joi.string().allow(null).optional(),
    document: joi.object().required(),
    hideFromPendingMessages: joi.boolean().optional(),
    highPriority: joi.boolean().optional(),
    inProgress: joi.boolean().optional(),
    isInitializeCase: joi.boolean().optional(),
    isQC: joi.boolean().required(),
    isRead: joi.boolean().optional(),
    messages: joi.array().items(joi.object()).required(),
    section: joi.string().required(),
    sentBy: joi.string().required(),
    sentBySection: joi.string().optional(),
    sentByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    trialDate: joi.date().iso().optional().allow(null),
    updatedAt: joi.date().iso().required(),
    workItemId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
  }),
  function () {
    return Message.validateCollection(this.messages);
  },
);

/**
 *
 * @param {Message} message the message to add to the work item
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.addMessage = function (message) {
  this.messages = [...this.messages, message];
  return this;
};

WorkItem.prototype.setAsInternal = function () {
  this.isQC = false;
  return this;
};

/**
 * get the latest message (by createdAt)
 *
 * @returns {Message} the latest message entity by date
 */
WorkItem.prototype.getLatestMessageEntity = function () {
  return orderBy(this.messages, 'createdAt', 'desc')[0];
};

/**
 * Assign to a user
 *
 * @param {object} props the props object
 * @param {string} props.assigneeId the user id of the user to assign the work item to
 * @param {string} props.assigneeName the name of the user to assign the work item to
 * @param {string} props.role the role of the user to assign the work item to
 * @param {string} props.sentBy the name of the user who sent the work item
 * @param {string} props.sentByUserId the user id of the user who sent the work item
 * @param {string} props.sentByUserRole the role of the user who sent the work item
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.assignToUser = function ({
  assigneeId,
  assigneeName,
  section,
  sentBy,
  sentBySection,
  sentByUserId,
}) {
  Object.assign(this, {
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  });
  return this;
};

WorkItem.prototype.setStatus = function (status) {
  this.caseStatus = status;
};

/**
 *
 * @param {object} props the props object
 * @param {string} props.message the message the user entered when setting as completed
 * @param {object} props.user the user who triggered the complete action
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.setAsCompleted = function ({ message, user }) {
  this.completedAt = createISODateString();
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedMessage = message;
  delete this.inProgress;
  return this;
};

module.exports = { WorkItem };
