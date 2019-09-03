const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { IRS_BATCH_SYSTEM_SECTION, PETITIONS_SECTION } = require('./WorkQueue');
const { Message } = require('./Message');
const { orderBy } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawWorkItem the raw work item data
 * @constructor
 */
function WorkItem(rawWorkItem) {
  this.assigneeId = rawWorkItem.assigneeId;
  this.assigneeName = rawWorkItem.assigneeName;
  this.caseId = rawWorkItem.caseId;
  this.caseStatus = rawWorkItem.caseStatus;
  this.caseTitle = rawWorkItem.caseTitle;
  this.completedAt = rawWorkItem.completedAt;
  this.completedBy = rawWorkItem.completedBy;
  this.completedByUserId = rawWorkItem.completedByUserId;
  this.completedMessage = rawWorkItem.completedMessage;
  this.createdAt = rawWorkItem.createdAt || createISODateString();
  this.docketNumber = rawWorkItem.docketNumber;
  this.docketNumberSuffix = rawWorkItem.docketNumberSuffix;
  this.document = rawWorkItem.document;
  this.isInitializeCase = rawWorkItem.isInitializeCase;
  this.isInternal =
    rawWorkItem.isInternal === undefined ? true : rawWorkItem.isInternal;
  this.isRead = rawWorkItem.isRead;
  this.section = rawWorkItem.section;
  this.sentBy = rawWorkItem.sentBy;
  this.sentBySection = rawWorkItem.sentBySection;
  this.sentByUserId = rawWorkItem.sentByUserId;
  this.updatedAt = rawWorkItem.updatedAt || createISODateString();
  this.workItemId = rawWorkItem.workItemId || uuid.v4();
  this.messages = (rawWorkItem.messages || []).map(
    message => new Message(message),
  );
}

const IRS_BATCH_SYSTEM_USER_ID = '63784910-c1af-4476-8988-a02f92da8e09';

WorkItem.validationName = 'WorkItem';

joiValidationDecorator(
  WorkItem,
  joi.object().keys({
    assigneeId: joi
      .string()
      .allow(null)
      .optional(),
    assigneeName: joi
      .string()
      .allow(null)
      .optional(), // should be a Message entity at some point
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
    caseStatus: joi.string().optional(),
    completedAt: joi
      .date()
      .iso()
      .optional(),
    completedBy: joi
      .string()
      .optional()
      .allow(null),
    completedByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .allow(null),
    completedMessage: joi
      .string()
      .optional()
      .allow(null),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    docketNumber: joi.string().required(),
    docketNumberSuffix: joi
      .string()
      .allow(null)
      .optional(),
    document: joi.object().required(),
    isInitializeCase: joi.boolean().optional(),
    isRead: joi.boolean().optional(),
    messages: joi
      .array()
      .items(joi.object())
      .required(),
    section: joi.string().required(),
    sentBy: joi.string().required(),
    sentBySection: joi.string().optional(),
    sentByUserId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    updatedAt: joi
      .date()
      .iso()
      .required(),
    workItemId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required(),
  }),
  function() {
    return Message.validateCollection(this.messages);
  },
);

/**
 *
 * @param {Message} message the message to add to the work item
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.addMessage = function(message) {
  this.messages = [...this.messages, message];
  return this;
};

WorkItem.prototype.setAsInternal = function() {
  this.isInternal = true;
  return this;
};

/**
 * get the latest message (by createdAt)
 *
 * @returns {Message} the latest message entity by date
 */
WorkItem.prototype.getLatestMessageEntity = function() {
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
WorkItem.prototype.assignToUser = function({
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

WorkItem.prototype.setStatus = function(status) {
  this.caseStatus = status;
};

/**
 *
 * @param {object} props the props object
 * @param {string} props.name the name of the user who triggered the assign action
 * @param {string} props.userId the user id of the user who triggered the assign action
 * @param {string} props.userRole the role of the user who triggered the assign action
 */
WorkItem.prototype.assignToIRSBatchSystem = function({
  name,
  userId,
  userSection,
}) {
  this.assignToUser({
    assigneeId: IRS_BATCH_SYSTEM_USER_ID,
    assigneeName: 'IRS Holding Queue',
    section: IRS_BATCH_SYSTEM_SECTION,
    sentBy: name,
    sentBySection: userSection,
    sentByUserId: userId,
  });
  this.addMessage(
    new Message({
      from: name,
      fromUserId: userId,
      message: 'Petition batched for IRS',
      to: 'IRS Holding Queue',
      toUserId: IRS_BATCH_SYSTEM_USER_ID,
    }),
  );
};

/**
 *
 * @param {object} props the props object
 * @param {string} props.user the user who recalled the work item from the IRS queue
 * @returns {Message} the message created when the work item was recalled
 */
WorkItem.prototype.recallFromIRSBatchSystem = function({ user }) {
  const message = new Message({
    from: 'IRS Holding Queue',
    fromUserId: IRS_BATCH_SYSTEM_USER_ID,
    message: 'Petition recalled from IRS Holding Queue',
    to: user.name,
    toUserId: user.userId,
  });

  this.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });
  this.section = PETITIONS_SECTION;
  this.addMessage(message);
  return message;
};

/**
 *
 * @param {object} props the props object
 * @param {string} props.message the message the user entered when setting as completed
 * @param {object} props.user the user who triggered the complete action
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.setAsCompleted = function({ message, user }) {
  this.completedAt = createISODateString();
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedMessage = message;

  return this;
};

/**
 * complete the work item as the IRS user with the message 'Served on IRS'
 *
 * @param {object} props the props object
 * @param {string} props.batchedByName the name of the user who batched the work item
 * @param {object} props.batchedByUserId the user id of the user who batched the work item
 * @returns {WorkItem} the updated work item
 */
WorkItem.prototype.setAsSentToIRS = function({
  batchedByName,
  batchedByUserId,
}) {
  this.completedAt = createISODateString();
  this.completedMessage = 'Served on IRS';
  this.completedBy = batchedByName;
  this.completedByUserId = batchedByUserId;

  this.addMessage(
    new Message({
      from: 'IRS Holding Queue',
      fromUserId: IRS_BATCH_SYSTEM_USER_ID,
      message: 'Served on IRS',
      to: null,
      toUserId: null,
    }),
  );

  return this;
};

module.exports = { WorkItem };
