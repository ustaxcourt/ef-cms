const courtIssuedEventCodes = require('../../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');
const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { flatten } = require('lodash');
const { Order } = require('./orders/Order');
const { WorkItem } = require('./WorkItem');

Document.PETITION_DOCUMENT_TYPES = ['Petition'];
Document.CATEGORIES = Object.keys(documentMapExternal);
Document.CATEGORY_MAP = documentMapExternal;
Document.INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
Document.INTERNAL_CATEGORY_MAP = documentMapInternal;
Document.COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;

Document.validationName = 'Document';

/**
 * constructor
 *
 * @param {object} rawDocument the raw document data
 * @constructor
 */
function Document(rawDocument, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.addToCoversheet = rawDocument.addToCoversheet;
  this.attachments = rawDocument.attachments;
  this.caseId = rawDocument.caseId;
  this.category = rawDocument.category;
  this.certificateOfService = rawDocument.certificateOfService;
  this.certificateOfServiceDate = rawDocument.certificateOfServiceDate;
  this.createdAt = rawDocument.createdAt || createISODateString();
  this.docketNumber = rawDocument.docketNumber;
  this.documentId = rawDocument.documentId;
  this.documentTitle = rawDocument.documentTitle;
  this.documentType = rawDocument.documentType;
  this.draftState = rawDocument.draftState;
  this.isFileAttached = rawDocument.isFileAttached;
  this.eventCode = rawDocument.eventCode;
  this.exhibits = rawDocument.exhibits;
  this.filedBy = rawDocument.filedBy;
  this.freeText = rawDocument.freeText;
  this.freeText2 = rawDocument.freeText2;
  this.hasSupportingDocuments = rawDocument.hasSupportingDocuments;
  this.isPaper = rawDocument.isPaper;
  this.lodged = rawDocument.lodged;
  this.objections = rawDocument.objections;
  this.ordinalValue = rawDocument.ordinalValue;
  this.partyPrimary = rawDocument.partyPrimary;
  this.partyRespondent = rawDocument.partyRespondent;
  this.partySecondary = rawDocument.partySecondary;
  this.pending =
    rawDocument.pending === undefined
      ? Document.isPendingOnCreation(rawDocument)
      : rawDocument.pending;
  this.practitioner = rawDocument.practitioner;
  this.previousDocument = rawDocument.previousDocument;
  this.processingStatus = rawDocument.processingStatus;
  this.receivedAt = rawDocument.receivedAt || createISODateString();
  this.relationship = rawDocument.relationship;
  this.scenario = rawDocument.scenario;
  this.secondaryDocument = rawDocument.secondaryDocument;
  this.servedAt = rawDocument.servedAt;
  this.servedParties = rawDocument.servedParties;
  this.serviceDate = rawDocument.serviceDate;
  this.serviceStamp = rawDocument.serviceStamp;
  this.signedAt = rawDocument.signedAt;
  this.signedByUserId = rawDocument.signedByUserId;
  this.status = rawDocument.status;
  this.supportingDocument = rawDocument.supportingDocument;
  this.trialLocation = rawDocument.trialLocation;
  this.userId = rawDocument.userId;
  this.workItems = rawDocument.workItems;
  this.archived = rawDocument.archived;
  this.qcAt = rawDocument.qcAt;
  this.qcByUserId = rawDocument.qcByUserId;
  this.qcByUser = rawDocument.qcByUser;
  this.processingStatus = this.processingStatus || 'pending';
  this.workItems = (this.workItems || []).map(
    workItem => new WorkItem(workItem, { applicationContext }),
  );

  this.generateFiledBy(rawDocument);
}

const practitionerAssociationDocumentTypes = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

/**
 * documentTypes
 *
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, stin: string}}
 */
Document.INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
  },
  ownershipDisclosure: {
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'ODS',
  },
  petition: {
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
  },
};

Document.NOTICE_OF_DOCKET_CHANGE = {
  documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
  documentType: 'Notice of Docket Change',
  eventCode: 'NODC',
};

Document.SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

Document.TRACKED_DOCUMENT_TYPES = {
  application: {
    category: 'Application',
  },
  motion: {
    category: 'Motion',
  },
  orderToShowCause: {
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  proposedStipulatedDecision: {
    documentType: 'Proposed Stipulated Decision',
    eventCode: 'PSDEC',
  },
};

Document.isPendingOnCreation = rawDocument => {
  const isPending = Object.values(Document.TRACKED_DOCUMENT_TYPES).some(
    trackedType => {
      return (
        (rawDocument.category &&
          trackedType.category === rawDocument.category) ||
        (rawDocument.eventCode &&
          trackedType.eventCode === rawDocument.eventCode)
      );
    },
  );
  return isPending;
};

Document.getDocumentTypes = () => {
  const allFilingEvents = flatten([
    ...Object.values(documentMapExternal),
    ...Object.values(documentMapInternal),
  ]);
  const filingEventTypes = allFilingEvents.map(t => t.documentType);
  const orderDocTypes = Order.ORDER_TYPES.map(t => t.documentType);
  const courtIssuedDocTypes = Document.COURT_ISSUED_EVENT_CODES.map(
    t => t.documentType,
  );
  const initialTypes = Object.keys(Document.INITIAL_DOCUMENT_TYPES).map(
    t => Document.INITIAL_DOCUMENT_TYPES[t].documentType,
  );
  const signedTypes = Object.keys(Document.SIGNED_DOCUMENT_TYPES).map(
    t => Document.SIGNED_DOCUMENT_TYPES[t].documentType,
  );
  const documentTypes = [
    ...initialTypes,
    ...practitionerAssociationDocumentTypes,
    ...filingEventTypes,
    ...orderDocTypes,
    ...courtIssuedDocTypes,
    ...signedTypes,
    Document.NOTICE_OF_DOCKET_CHANGE.documentType,
  ];

  return documentTypes;
};

/**
 *
 * @returns {boolean} true if the document is a petition document type, false otherwise
 */
Document.prototype.isPetitionDocument = function() {
  return Document.PETITION_DOCUMENT_TYPES.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    archived: joi.boolean().optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
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
    freeText: joi.string().optional(),
    freeText2: joi.string().optional(),
    isPaper: joi.boolean().optional(),
    lodged: joi.boolean().optional(),
    ordinalValue: joi.string().optional(),
    pending: joi.boolean().optional(),
    processingStatus: joi.string().optional(),
    qcAt: joi
      .date()
      .iso()
      .optional(),
    qcByUserId: joi
      .string()
      .optional()
      .allow(null),
    receivedAt: joi
      .date()
      .iso()
      .optional(),
    secondaryDocument: joi.object().optional(),
    servedAt: joi
      .date()
      .iso()
      .optional(),
    servedParties: joi.array().optional(),
    serviceDate: joi
      .date()
      .iso()
      .max('now')
      .optional()
      .allow(null),
    serviceStamp: joi.string().optional(),
    signedAt: joi
      .date()
      .iso()
      .optional()
      .allow(null),
    signedByUserId: joi
      .string()
      .optional()
      .allow(null),
    status: joi.string().optional(),
    trialLocation: joi.string().optional(),
    userId: joi.string().required(),
  }),
  function() {
    return WorkItem.validateCollection(this.workItems);
  },
);

/**
 *
 * @param {WorkItem} workItem the work item to add to the document
 */
Document.prototype.addWorkItem = function(workItem) {
  this.workItems = [...this.workItems, workItem];
};

/**
 * sets the document as archived (used to hide from the ui)
 *
 */
Document.prototype.archive = function() {
  this.archived = true;
};

Document.prototype.setAsServed = function(servedParties = null) {
  this.status = 'served';
  this.servedAt = createISODateString();
  if (servedParties) {
    this.servedParties = servedParties;
  }
};

/**
 * generates the filedBy string from parties selected for the document
and contact info from the case detail
 *
 * @param {object} caseDetail the case detail
 * @param {boolean} force flag to force filedBy's generation
 */
Document.prototype.generateFiledBy = function(caseDetail, force = false) {
  if (force || !this.filedBy) {
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
      this.partySecondary &&
      !this.partyPrimary &&
      caseDetail.contactSecondary
    ) {
      filedByArray.push(`Petr. ${caseDetail.contactSecondary.name}`);
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

    if (filedByArray.length) {
      this.filedBy = filedByArray.join(' & ');
    }
  }
};
/**
 * attaches a signedAt date to the document
 *
 * @param {string} signByUserId the user id of the user who signed the document
 *
 */
Document.prototype.setSigned = function(signByUserId) {
  this.signedByUserId = signByUserId;
  this.signedAt = createISODateString();
};

/**
 * attaches a qc date and a user to the document
 *
 * @param {object} user the user completing QC process
 */
Document.prototype.setQCed = function(user) {
  this.qcByUser = user;
  this.qcAt = createISODateString();
};

Document.prototype.unsignDocument = function() {
  this.signedAt = null;
  this.signedByUserId = null;
};

Document.prototype.setAsProcessingStatusAsCompleted = function() {
  this.processingStatus = 'complete';
};

exports.Document = Document;
