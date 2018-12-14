const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};
const uuid = require('uuid');

/**
 * constructor
 * @param rawWorkItem
 * @constructor
 */
function WorkItem(rawWorkItem) {
  Object.assign(this, rawWorkItem, {
    workItemId: rawWorkItem.workItemId ? rawWorkItem.workItemId : uuid.v4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
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
      .required(),
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
    assigneName: joi.string().required(),
    caseTitle: joi.string().required(),
    caseStatus: joi.string().required(),
    document: joi.object().required(), // should be a Document entity at some point
  }),
);

module.exports = WorkItem;
