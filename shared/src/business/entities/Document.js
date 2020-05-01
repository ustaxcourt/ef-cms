const courtIssuedEventCodes = require('../../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');
const joi = require('@hapi/joi');
const {
  DOCKET_NUMBER_MATCHER,
  TRIAL_LOCATION_MATCHER,
} = require('./cases/CaseConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { createISODateString } = require('../utilities/DateHandler');
const { flatten } = require('lodash');
const { Order } = require('./orders/Order');
const { TrialSession } = require('./trialSessions/TrialSession');
const { User } = require('./User');
const { WorkItem } = require('./WorkItem');

Document.CATEGORIES = Object.keys(documentMapExternal);
Document.CATEGORY_MAP = documentMapExternal;
Document.NOTICE_EVENT_CODES = ['NOT'];
Document.COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;
Document.INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
Document.INTERNAL_CATEGORY_MAP = documentMapInternal;
Document.PETITION_DOCUMENT_TYPES = ['Petition'];
Document.ORDER_DOCUMENT_TYPES = [
  'O',
  'OAJ',
  'OAL',
  'OAP',
  'OAPF',
  'OAR',
  'OAS',
  'OASL',
  'OAW',
  'OAX',
  'OCA',
  'OD',
  'ODD',
  'ODL',
  'ODP',
  'ODR',
  'ODS',
  'ODSL',
  'ODW',
  'ODX',
  'OF',
  'OFAB',
  'OFFX',
  'OFWD',
  'OFX',
  'OIP',
  'OJR',
  'OODS',
  'OPFX',
  'OPX',
  'ORAP',
  'OROP',
  'OSC',
  'OSCP',
  'OST',
  'OSUB',
  'OAD',
  'ODJ',
];
Document.validationName = 'Document';

/**
 * constructor
 *
 * @param {object} rawDocument the raw document data
 * @constructor
 */
function Document(rawDocument, { applicationContext, filtered = false }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.entityName = 'Document';

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    this.draftState = rawDocument.draftState;
    this.judge = rawDocument.judge;
    this.pending =
      rawDocument.pending === undefined
        ? Document.isPendingOnCreation(rawDocument)
        : rawDocument.pending;
    this.previousDocument = rawDocument.previousDocument;
    this.processingStatus = rawDocument.processingStatus || 'pending'; // TODO: restricted
    this.qcAt = rawDocument.qcAt;
    this.qcByUser = rawDocument.qcByUser;
    this.qcByUserId = rawDocument.qcByUserId;
    this.signedAt = rawDocument.signedAt;
    this.signedByUserId = rawDocument.signedByUserId;
    this.signedJudgeName = rawDocument.signedJudgeName;
    this.workItems = (rawDocument.workItems || []).map(
      workItem => new WorkItem(workItem, { applicationContext }),
    );
  }

  this.additionalInfo = rawDocument.additionalInfo;
  this.additionalInfo2 = rawDocument.additionalInfo2;
  this.addToCoversheet = rawDocument.addToCoversheet;
  this.archived = rawDocument.archived; // TODO: look into this
  this.attachments = rawDocument.attachments;
  this.documentContents = rawDocument.documentContents;
  this.caseId = rawDocument.caseId;
  this.certificateOfService = rawDocument.certificateOfService;
  this.certificateOfServiceDate = rawDocument.certificateOfServiceDate;
  this.createdAt = rawDocument.createdAt || createISODateString();
  this.date = rawDocument.date;
  this.docketNumber = rawDocument.docketNumber;
  this.documentId = rawDocument.documentId;
  this.documentTitle = rawDocument.documentTitle;
  this.documentType = rawDocument.documentType;
  this.eventCode = rawDocument.eventCode;
  this.filedBy = rawDocument.filedBy;
  this.filingDate = rawDocument.filingDate || createISODateString();
  this.freeText = rawDocument.freeText;
  this.freeText2 = rawDocument.freeText2;
  this.hasSupportingDocuments = rawDocument.hasSupportingDocuments;
  this.isFileAttached = rawDocument.isFileAttached;
  this.isPaper = rawDocument.isPaper;
  this.lodged = rawDocument.lodged;
  this.mailingDate = rawDocument.mailingDate;
  this.objections = rawDocument.objections;
  this.ordinalValue = rawDocument.ordinalValue;
  this.partyPrimary = rawDocument.partyPrimary; // TODO: add info about purpose
  this.partyIrsPractitioner = rawDocument.partyIrsPractitioner;
  this.partySecondary = rawDocument.partySecondary; // TODO: add info about purpose
  this.privatePractitioners = rawDocument.privatePractitioners; // TODO: look into this
  this.receivedAt = rawDocument.receivedAt || createISODateString();
  this.relationship = rawDocument.relationship; // TODO: look into this
  this.scenario = rawDocument.scenario; // TODO: look into this
  this.secondaryDate = rawDocument.secondaryDate; // TODO: look into this
  this.secondaryDocument = rawDocument.secondaryDocument; // TODO: look into this
  this.servedAt = rawDocument.servedAt;
  this.numberOfPages = rawDocument.numberOfPages;
  this.servedParties = rawDocument.servedParties;
  this.serviceDate = rawDocument.serviceDate;
  this.serviceStamp = rawDocument.serviceStamp;
  this.status = rawDocument.status; // TODO: look into this
  this.supportingDocument = rawDocument.supportingDocument;
  this.trialLocation = rawDocument.trialLocation; // TODO: look into this
  this.userId = rawDocument.userId; // TODO: restricted

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
    eventCode: 'DISC',
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

Document.NOTICE_OF_TRIAL = {
  documentTitle: 'Notice of Trial on [Date] at [Time]',
  documentType: 'Notice of Trial',
  eventCode: 'NDT',
};

Document.STANDING_PRETRIAL_NOTICE = {
  documentTitle: 'Standing Pretrial Notice',
  documentType: 'Standing Pretrial Notice',
  eventCode: 'SPTN',
};

Document.STANDING_PRETRIAL_ORDER = {
  documentTitle: 'Standing Pretrial Order',
  documentType: 'Standing Pretrial Order',
  eventCode: 'SPTO',
};

Document.SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: Document.NOTICE_OF_DOCKET_CHANGE,
  noticeOfTrial: Document.NOTICE_OF_TRIAL,
  standingPretrialNotice: Document.STANDING_PRETRIAL_NOTICE,
  standingPretrialOrder: Document.STANDING_PRETRIAL_ORDER,
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
    eventCode: 'PSDE',
  },
};

Document.CONTACT_CHANGE_DOCUMENT_TYPES = [
  'Notice of Change of Address',
  'Notice of Change of Telephone Number',
  'Notice of Change of Address and Telephone Number',
];

Document.TRANSCRIPT_EVENT_CODE = 'TRAN';

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
  const systemGeneratedTypes = Object.keys(
    Document.SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(t => Document.SYSTEM_GENERATED_DOCUMENT_TYPES[t].documentType);

  const documentTypes = [
    ...initialTypes,
    ...practitionerAssociationDocumentTypes,
    ...filingEventTypes,
    ...orderDocTypes,
    ...courtIssuedDocTypes,
    ...signedTypes,
    ...systemGeneratedTypes,
  ];

  return documentTypes;
};

/**
 *
 * @returns {Array} event codes defined in the Document entity
 */
Document.eventCodes = [
  Document.INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
  Document.INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  Document.INITIAL_DOCUMENT_TYPES.petition.eventCode,
  Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
  Document.INITIAL_DOCUMENT_TYPES.stin.eventCode,
  Document.NOTICE_OF_DOCKET_CHANGE.eventCode,
  Document.NOTICE_OF_TRIAL.eventCode,
  Document.STANDING_PRETRIAL_NOTICE.eventCode,
  Document.STANDING_PRETRIAL_ORDER.eventCode,
  // TODO: Move these constants
  'MISL',
  'FEE',
  'FEEW',
  'MGRTED',
  'MIND',
  'MINC',
];

/**
 *
 * @returns {boolean} true if the document is a petition document type, false otherwise
 */
Document.prototype.isPetitionDocument = function () {
  return Document.PETITION_DOCUMENT_TYPES.includes(this.documentType);
};

joiValidationDecorator(
  Document,
  joi.object().keys({
    addToCoversheet: joi.boolean().optional(),
    additionalInfo: joi.string().optional(),
    additionalInfo2: joi.string().optional(),
    archived: joi.boolean().optional(),
    caseId: joi
      .string()
      .optional()
      .description('Unique ID of the associated Case.'),
    certificateOfService: joi.boolean().optional(),
    certificateOfServiceDate: joi.when('certificateOfService', {
      is: true,
      otherwise: joi.optional(),
      then: joi.date().iso().required(),
    }),
    createdAt: joi
      .date()
      .iso()
      .required()
      .description('When the Document was added to the system.'),
    date: joi
      .date()
      .iso()
      .optional()
      .allow(null)
      .description(
        'An optional date used when generating a fully concatenated document title.',
      ),
    docketNumber: joi
      .string()
      .regex(DOCKET_NUMBER_MATCHER)
      .optional()
      .description('Docket Number of the associated Case in XXXXX-YY format.'),
    documentContents: joi.string().optional(),
    documentId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .required()
      .description('ID of the associated PDF document in the S3 bucket.'),
    documentTitle: joi
      .string()
      .optional()
      .description('The title of this document.'),
    documentType: joi
      .string()
      .valid(...Document.getDocumentTypes())
      .required()
      .description('The type of this document.'),
    draftState: joi.object().allow(null).optional(),
    entityName: joi.string().valid('Document').required(),
    eventCode: joi.string().optional(),
    filedBy: joi.string().allow('').optional(),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .required()
      .description('Date that this Document was filed.'),
    freeText: joi.string().optional(),
    freeText2: joi.string().optional(),
    hasSupportingDocuments: joi.boolean().optional(),
    isFileAttached: joi.boolean().optional(),
    isPaper: joi.boolean().optional(),
    judge: joi
      .string()
      .allow(null)
      .optional()
      .description('The judge associated with the document.'),
    lodged: joi
      .boolean()
      .optional()
      .description(
        'A lodged document is awaiting action by the judge to enact or refuse.',
      ),
    numberOfPages: joi.number().optional().allow(null),
    objections: joi.string().optional(),
    ordinalValue: joi.string().optional(),
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrimary: joi.boolean().optional(),
    partySecondary: joi.boolean().optional(),
    pending: joi.boolean().optional(),
    previousDocument: joi.object().optional(),
    privatePractitioners: joi.array().optional(),
    processingStatus: joi.string().optional(),
    qcAt: joi.date().iso().optional(),
    qcByUser: joi.object().optional(),
    qcByUserId: joi.string().optional().allow(null),
    receivedAt: joi.date().iso().optional(),
    relationship: joi.string().optional(),
    scenario: joi.string().optional(),
    secondaryDate: joi
      .date()
      .iso()
      .optional()
      .description(
        'A secondary date associated with the document, typically related to time-restricted availability.',
      ),
    // TODO: What's the difference between servedAt and serviceDate?
    secondaryDocument: joi.object().optional(),
    servedAt: joi.date().iso().optional(),
    servedParties: joi.array().optional(),
    serviceDate: joi.date().iso().max('now').optional().allow(null),
    serviceStamp: joi.string().optional(),
    signedAt: joi.date().iso().optional().allow(null),
    signedByUserId: joi.string().optional().allow(null),
    signedJudgeName: joi.string().optional().allow(null),
    status: joi.string().valid('served').optional(),
    supportingDocument: joi.string().optional().allow(null),
    trialLocation: joi
      .alternatives()
      .try(
        joi.string().valid(...TrialSession.TRIAL_CITY_STRINGS),
        joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
        joi.string().allow(null),
      )
      .optional(),
    userId: joi.string().required(),
    workItems: joi.array().optional(),
  }),
);

/**
 *
 * @param {WorkItem} workItem the work item to add to the document
 */
Document.prototype.addWorkItem = function (workItem) {
  this.workItems = [...this.workItems, workItem];
};

/**
 * sets the document as archived (used to hide from the ui)
 *
 */
Document.prototype.archive = function () {
  this.archived = true;
};

Document.prototype.setAsServed = function (servedParties = null) {
  this.status = 'served';
  this.servedAt = createISODateString();
  this.draftState = null;

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
Document.prototype.generateFiledBy = function (caseDetail, force = false) {
  if (force || !this.filedBy) {
    let filedByArray = [];
    this.partyIrsPractitioner && filedByArray.push('Resp.');

    Array.isArray(this.privatePractitioners) &&
      this.privatePractitioners.forEach(practitioner => {
        practitioner.partyPrivatePractitioner &&
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
 * @param {string} signedJudgeName the judge's signature for the document
 *
 */
Document.prototype.setSigned = function (signByUserId, signedJudgeName) {
  this.signedByUserId = signByUserId;
  this.signedJudgeName = signedJudgeName;
  this.signedAt = createISODateString();
};

/**
 * attaches a qc date and a user to the document
 *
 * @param {object} user the user completing QC process
 */
Document.prototype.setQCed = function (user) {
  this.qcByUser = user;
  this.qcAt = createISODateString();
};

Document.prototype.unsignDocument = function () {
  this.signedAt = null;
  this.signedJudgeName = null;
  this.signedByUserId = null;
};

Document.prototype.setAsProcessingStatusAsCompleted = function () {
  this.processingStatus = 'complete';
};

Document.prototype.getQCWorkItem = function () {
  return this.workItems.find(workItem => workItem.isQC === true);
};

Document.prototype.isAutoServed = function () {
  const externalDocumentTypes = flatten(Object.values(documentMapExternal)).map(
    t => t.documentType,
  );

  const isExternalDocumentType = externalDocumentTypes.includes(
    this.documentType,
  );
  const isPractitionerAssociationDocumentType = practitionerAssociationDocumentTypes.includes(
    this.documentType,
  );
  //if fully concatenated document title includes the word Simultaneous, do not auto-serve
  const isSimultaneous = (this.documentTitle || this.documentType).includes(
    'Simultaneous',
  );

  return (
    (isExternalDocumentType || isPractitionerAssociationDocumentType) &&
    !isSimultaneous
  );
};

exports.Document = Document;
