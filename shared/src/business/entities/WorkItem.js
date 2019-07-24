const joi = require('joi-browser');
const uuid = require('uuid');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { getSectionForRole, PETITIONS_SECTION } = require('./WorkQueue');
const { Message } = require('./Message');
const { orderBy } = require('lodash');

/**
 * constructor
 * @param rawWorkItem
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
  this.createdAt = rawWorkItem.createdAt || new Date().toISOString();
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
  this.updatedAt = rawWorkItem.updatedAt || new Date().toISOString();
  this.workItemId = rawWorkItem.workItemId || uuid.v4();
  this.messages = (rawWorkItem.messages || []).map(
    message => new Message(message),
  );
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
  name,
  userId,
  userRole,
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
 *
 * @param opts
 * @param opts.batchedByUserId
 * @param opts.batchedByName
 */
WorkItem.prototype.setAsSentToIRS = function({
  batchedByName,
  batchedByUserId,
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
