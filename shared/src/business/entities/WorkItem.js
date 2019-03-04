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
WorkItem.prototype.assignToUser = function({ assigneeId, assigneeName, role }) {
  Object.assign(this, {
    assigneeId,
    assigneeName,
    section: getSectionForRole(role),
  });
  return this;
};

/**
 *
 * @param userId
 */
WorkItem.prototype.assignToIRSBatchSystem = function({ userId }) {
  this.assignToUser({
    assigneeId: 'irsBatchSystem',
    assigneeName: 'IRS Holding Queue',
    role: 'irsBatchSystem',
  });
  this.addMessage(
    new Message({
      message: 'Petition batched for IRS',
      sentBy: userId,
      sentTo: 'IRS Holding Queue',
      userId: userId,
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
  });
  this.section = PETITIONS_SECTION;
  this.addMessage(
    new Message({
      message: 'Petition recalled from IRS Holding Queue',
      sentBy: 'IRS Holding Queue',
      sentTo: user.name,
      userId: 'irsBatchSystem',
    }),
  );
};

/**
 *
 * @param userId
 */
WorkItem.prototype.setAsCompleted = function(userId) {
  this.completedAt = new Date().toISOString();

  this.addMessage(
    new Message({
      message: 'work item completed',
      sentBy: userId,
      userId: userId,
    }),
  );
};

module.exports = WorkItem;
