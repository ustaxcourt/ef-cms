const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');

const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const uuidVersions = {
  version: ['uuidv4'],
};
const { flatten } = require('lodash');
const { WorkItem } = require('./WorkItem');

const petitionDocumentTypes = ['Petition'];

module.exports.CATEGORIES = Object.keys(documentMapExternal);
module.exports.CATEGORY_MAP = documentMapExternal;

module.exports.INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
module.exports.INTERNAL_CATEGORY_MAP = documentMapInternal;

/**
 * constructor
 * @param rawDocument
 * @constructor
 */
function Document(rawDocument) {
  Object.assign(this, {
    attachments: rawDocument.attachments,
    caseId: rawDocument.caseId,
    category: rawDocument.category,
    certificateOfService: rawDocument.certificateOfService,
    createdAt: rawDocument.createdAt || new Date().toISOString(),
    docketNumber: rawDocument.docketNumber,
    documentId: rawDocument.documentId,
    documentTitle: rawDocument.documentTitle,
    documentType: rawDocument.documentType,
    eventCode: rawDocument.eventCode,
    exhibits: rawDocument.exhibits,
    filedBy: rawDocument.filedBy,
    hasSupportingDocuments: rawDocument.hasSupportingDocuments,
    isPaper: rawDocument.isPaper,
    lodged: rawDocument.lodged,
    partyPrimary: rawDocument.partyPrimary,
    partyRespondent: rawDocument.partyRespondent,
    partySecondary: rawDocument.partySecondary,
    practitioner: rawDocument.practitioner,
    previousDocument: rawDocument.previousDocument,
    processingStatus: rawDocument.processingStatus,
    relationship: rawDocument.relationship,
    reviewDate: rawDocument.reviewDate,
    reviewUser: rawDocument.reviewUser,
    scenario: rawDocument.scenario,
    servedDate: rawDocument.servedDate,
    serviceDate: rawDocument.serviceDate,
    status: rawDocument.status,
    supportingDocument: rawDocument.supportingDocument,
    userId: rawDocument.userId,
    validated: rawDocument.validated,
    workItems: rawDocument.workItems,
  });

  this.processingStatus = this.processingStatus || 'pending';
  this.workItems = (this.workItems || []).map(
    workItem => new WorkItem(workItem),
  );
}

Document.name = 'Document';

const practitionerAssociationDocumentTypes = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

/**
 * documentTypes
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, stin: string}}
 */
Document.initialDocumentTypes = {
  ownershipDisclosure: 'Ownership Disclosure Statement',
  petitionFile: 'Petition',
  stin: 'Statement of Taxpayer Identification',
};

Document.getDocumentTypes = () => {
  const allFilingEvents = flatten([
    ...Object.values(documentMapExternal),
    ...Object.values(documentMapInternal),
  ]);
  const filingEventTypes = allFilingEvents.map(t => t.documentType);
  const documentTypes = [
    ...Object.values(Document.initialDocumentTypes),
    ...practitionerAssociationDocumentTypes,
    ...filingEventTypes,
  ];

  return documentTypes;
};

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
      .valid(Document.getDocumentTypes())
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
    this.partyRespondent && filedByArray.push('Resp.');

    Array.isArray(this.practitioner) &&
      this.practitioner.forEach(practitioner => {
        practitioner.partyPractitioner &&
          filedByArray.push(`Counsel ${practitioner.name}`);
      });

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
        `Petrs. ${caseDetail.contactPrimary.name} & ${caseDetail.contactSecondary.name}`,
      );
    }

    this.filedBy = filedByArray.join(' & ');
  }
};

exports.Document = Document;
