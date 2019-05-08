const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
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
  this.processingStatus = this.processingStatus || 'pending';
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
    eventCode: joi.string().optional(),
    filedBy: joi
      .string()
      .allow('')
      .optional(),
    isPaper: joi.boolean().optional(),
    lodged: joi.boolean().optional(),
    processingStatus: joi.string().optional(),
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
    userId: joi.string().required(),
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

/**
 * generates the filedBy string from parties selected for the document
 * and contact info from the case detail
 *
 * @param caseDetail
 */
Document.prototype.generateFiledBy = function(caseDetail) {
  if (!this.filedBy) {
    let filedByArray = [];
    if (this.partyRespondent) {
      filedByArray.push('Resp.');
    }
    if (this.partyPractitioner && this.practitioner) {
      filedByArray.push(`Counsel ${this.practitioner.name}`);
    }
    if (
      this.partyPrimary &&
      !this.partySecondary &&
      caseDetail.contactPrimary
    ) {
      filedByArray.push(`Petr. ${caseDetail.contactPrimary.name}`);
    } else if (
      this.partyPrimary &&
      this.partySecondary &&
      caseDetail.contactPrimary &&
      caseDetail.contactSecondary
    ) {
      filedByArray.push(
        `Petrs. ${caseDetail.contactPrimary.name} & ${
          caseDetail.contactSecondary.name
        }`,
      );
    }
    this.filedBy = filedByArray.join(' & ');
  }
};

exports.Document = Document;
