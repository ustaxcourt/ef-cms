const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const { getDocumentTypes } = require('./Case');

const uuidVersions = {
  version: ['uuidv4'],
};

const petitionDocumentTypes = ['Petition'];

const WorkItem = require('./WorkItem');

/**
 * constructor
 * @param rawDocument
 * @constructor
 */
function Document(rawDocument) {
  Object.assign(this, rawDocument, {
    createdAt: rawDocument.createdAt || new Date().toISOString(),
  });
  this.workItems = (this.workItems || []).map(
    workItem => new WorkItem(workItem),
  );
}

Document.name = 'Document';

Document.prototype.isPetitionDocument = function() {
  return petitionDocumentTypes.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    documentType: joi
      .string()
      .valid(getDocumentTypes())
      .required(),
    documentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .required(),
    filedBy: joi.string().optional(),
    validated: joi.boolean().optional(),
    reviewDate: joi
      .date()
      .iso()
      .optional(),
    reviewUser: joi.string().optional(),
    status: joi.string().optional(),
    servedDate: joi
      .date()
      .iso()
      .optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
  }),
  function() {
    return WorkItem.validateCollection(this.workItems);
  },
);

Document.prototype.addWorkItem = function(workItem) {
  this.workItems = [...(this.workItems || []), workItem];
};

module.exports = Document;
