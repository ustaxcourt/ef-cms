const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};
const uuid = require('uuid');
const Message = require('./Message');

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
    createdAt: joi
      .date()
      .iso()
      .optional(),
    updatedAt: joi
      .date()
      .iso()
      .required(),
    assigneeId: joi.string().required(),
    docketNumber: joi.string().required(),
    caseId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    assigneeName: joi.string().required(),
    document: joi.object().required(),
  }),
  function() {
    return Message.validateCollection(this.messages);
  },
);

WorkItem.prototype.addMessage = function(message) {
  this.messages = [...(this.messages || []), message];
};

module.exports = WorkItem;
