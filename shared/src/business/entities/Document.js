const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

const { Case } = require('./Case');
const { getDocumentTypes } = Case;

const uuidVersions = {
  version: ['uuidv4'],
};

const petitionDocumentTypes = ['Petition'];

const { WorkItem } = require('./WorkItem');

const documentMap = require('../../tools/externalFilingEvents.json');

module.exports.CATEGORIES = Object.keys(documentMap);
module.exports.CATEGORY_MAP = documentMap;

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

/**
 *
 * @returns {boolean}
 */
Document.prototype.isPetitionDocument = function() {
  return petitionDocumentTypes.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    createdAt: joi
      .date()
      .iso()
      .optional(),
    documentId: joi
      .string()
      .uuid(uuidVersions)
      .required(),
    documentType: joi
      .string()
      .valid(getDocumentTypes())
      .required(),
    filedBy: joi.string().optional(),
    reviewDate: joi
      .date()
      .iso()
      .optional(),
    reviewUser: joi.string().optional(),
    servedDate: joi
      .date()
      .iso()
      .optional(),
    status: joi.string().optional(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .required(),
    validated: joi.boolean().optional(),
  }),
  function() {
    return WorkItem.validateCollection(this.workItems);
  },
);

/**
 *
 * @param workItem
 */
Document.prototype.addWorkItem = function(workItem) {
  this.workItems = [...this.workItems, workItem];
};

exports.Document = Document;
