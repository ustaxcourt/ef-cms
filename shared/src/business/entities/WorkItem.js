const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};
const uuid = require('uuid');
const Message = require('./Message');
const { getSectionForRole, PETITIONS_SECTION } = require('./WorkQueue');

/**
 * constructor
 * @param rawWorkItem
 * @constructor
 */
function WorkItem(rawWorkItem) {
  Object.assign(this, rawWorkItem, {
    createdAt: rawWorkItem.createdAt || new Date().toISOString(),
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
  this.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    role: user.role,
    sentBy: user.name,
    sentByUserId: user.userId,
    sentByUserRole: user.role,
  });
  this.section = PETITIONS_SECTION;
  this.addMessage(
    new Message({
      from: 'IRS Holding Queue',
      fromUserId: IRS_BATCH_SYSTEM_USER_ID,
      message: 'Petition recalled from IRS Holding Queue',
      to: user.name,
      toUserId: user.userId,
    }),
  );
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
WorkItem.prototype.setAsSentToIRS = function() {
  this.completedAt = new Date().toISOString();
  this.completedMessage = 'Served on IRS';

  return this;
};

module.exports = WorkItem;
