const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};
const uuid = require('uuid');
const Message = require('./Message');
const { getSectionForRole } = require('./WorkQueue');

/**
 * constructor
 * @param rawWorkItem
 * @constructor
 */
function WorkItem(rawWorkItem) {
  Object.assign(this, rawWorkItem, {
    workItemId: rawWorkItem.workItemId || uuid.v4(),
    createdAt: rawWorkItem.createdAt || new Date().toISOString(),
    updatedAt: rawWorkItem.updatedAt || new Date().toISOString(),
  });

  this.messages = (this.messages || []).map(message => new Message(message));
}

WorkItem.name = 'WorkItem';

joiValidationDecorator(
  WorkItem,
  joi.object().keys({
    workItemId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    messages: joi
      .array()
      .items(joi.object())
      .required(), // should be a Message entity at some point
    sentBy: joi.string().required(),
    section: joi.string().required(),
    assigneeId: joi
      .string()
      .allow(null)
      .optional(),
    assigneeName: joi
      .string()
      .allow(null)
      .optional(),
    docketNumber: joi.string().required(),
    docketNumberSuffix: joi
      .string()
      .allow(null)
      .optional(),
    caseId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    caseStatus: joi.string().optional(),
    document: joi.object().required(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    updatedAt: joi
      .date()
      .iso()
      .required(),
    completedAt: joi
      .date()
      .iso()
      .optional(),
    isInitializeCase: joi.boolean().optional(),
  }),
  function() {
    return Message.validateCollection(this.messages);
  },
);

WorkItem.prototype.addMessage = function(message) {
  this.messages = [...this.messages, message];
  return this;
};

WorkItem.prototype.assignToUser = function({ assigneeId, assigneeName, role }) {
  Object.assign(this, {
    assigneeId,
    assigneeName,
    section: getSectionForRole(role),
  });
  return this;
};

WorkItem.prototype.assignToIRSBatchSystem = function({ userId }) {
  this.assignToUser({
    assigneeId: 'irsBatchSystem',
    role: 'irsBatchSystem',
    assigneeName: 'IRS Holding Queue',
  });
  this.addMessage(
    new Message({
      message: 'Petition batched for IRS',
      sentBy: userId,
      userId: userId,
    }),
  );
};

WorkItem.prototype.recallFromIRSBatchSystem = function({ user }) {
  this.assignToUser({
    assigneeId: user.userId,
    role: user.role,
    assigneeName: user.name,
  });
  this.addMessage(
    new Message({
      message: 'Petition recalled from IRS Holding Queue',
      sentBy: user.userId,
      userId: user.userId,
    }),
  );
};

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
