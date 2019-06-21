const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getSectionForRole, PETITIONS_SECTION } = require('./WorkQueue');
const { Message } = require('./Message');
const { orderBy } = require('lodash');

const uuidVersions = {
  version: ['uuidv4'],
};

/**
 * constructor
 * @param rawWorkItem
 * @constructor
 */
function WorkItem(rawWorkItem) {
  Object.assign(this, {
    assigneeId: rawWorkItem.assigneeId,
    assigneeName: rawWorkItem.assigneeName,
    caseId: rawWorkItem.caseId,
    caseStatus: rawWorkItem.caseStatus,
    caseTitle: rawWorkItem.caseTitle,
    completedAt: rawWorkItem.completedAt,
    completedBy: rawWorkItem.completedBy,
    completedByUserId: rawWorkItem.completedByUserId,
    completedMessage: rawWorkItem.completedMessage,
    createdAt: rawWorkItem.createdAt || new Date().toISOString(),
    docketNumber: rawWorkItem.docketNumber,
    docketNumberSuffix: rawWorkItem.docketNumberSuffix,
    document: rawWorkItem.document,
    isInitializeCase: rawWorkItem.isInitializeCase,
    isInternal:
      rawWorkItem.isInternal === undefined ? true : rawWorkItem.isInternal,
    isRead: rawWorkItem.isRead,
    messages: rawWorkItem.messages,
    section: rawWorkItem.section,
    sentBy: rawWorkItem.sentBy,
    sentBySection: rawWorkItem.sentBySection,
    sentByUserId: rawWorkItem.sentByUserId,
    updatedAt: rawWorkItem.updatedAt || new Date().toISOString(),
    workItemId: rawWorkItem.workItemId || uuid.v4(),
  });

  this.messages = (this.messages || []).map(message => new Message(message));
}

const IRS_BATCH_SYSTEM_USER_ID = '63784910-c1af-4476-8988-a02f92da8e09';

WorkItem.name = 'WorkItem';

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
      .uuid(uuidVersions)
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
      .uuid(uuidVersions)
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
      .uuid(uuidVersions)
      .optional(),
    updatedAt: joi
      .date()
      .iso()
      .required(),
    workItemId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
  }),
  function() {
    return Message.validateCollection(this.messages);
  },
);

/**
 *
 * @param message
 * @returns {WorkItem}
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
 * @returns {Message}
 */
WorkItem.prototype.getLatestMessageEntity = function() {
  return orderBy(this.messages, 'createdAt', 'desc')[0];
};

/**
 *
 * @param assigneeId
 * @param assigneeName
 * @param role
 * @returns {WorkItem}
 */
WorkItem.prototype.assignToUser = function({
  assigneeId,
  assigneeName,
  role,
  sentBy,
  sentByUserId,
  sentByUserRole,
}) {
  Object.assign(this, {
    assigneeId,
    assigneeName,
    section: getSectionForRole(role),
    sentBy,
    sentBySection: getSectionForRole(sentByUserRole),
    sentByUserId,
  });
  return this;
};

WorkItem.prototype.setStatus = function(status) {
  this.caseStatus = status;
};

/**
 *
 * @param userId
 */
WorkItem.prototype.assignToIRSBatchSystem = function({
  userRole,
  userId,
  name,
}) {
  this.assignToUser({
    assigneeId: IRS_BATCH_SYSTEM_USER_ID,
    assigneeName: 'IRS Holding Queue',
    role: 'irsBatchSystem',
    sentBy: name,
    sentByUserId: userId,
    sentByUserRole: userRole,
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
 * @param user
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
    role: user.role,
    sentBy: user.name,
    sentByUserId: user.userId,
    sentByUserRole: user.role,
  });
  this.section = PETITIONS_SECTION;
  this.addMessage(message);
  return message;
};

/**
 *
 * @param userId
 */
WorkItem.prototype.setAsCompleted = function({ message, user }) {
  this.completedAt = new Date().toISOString();
  this.completedBy = user.name;
  this.completedByUserId = user.userId;
  this.completedMessage = message;

  return this;
};

/**
 * complete the work item as the IRS user with the message 'Served on IRS'
 */
WorkItem.prototype.setAsSentToIRS = function({
  batchedByUserId,
  batchedByName,
}) {
  this.completedAt = new Date().toISOString();
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
