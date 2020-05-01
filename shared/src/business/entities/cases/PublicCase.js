const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Document } = require('../Document');
const { map } = require('lodash');
const { Order } = require('../orders/Order');
const { PublicContact } = require('./PublicContact');
const { PublicDocketRecordEntry } = require('./PublicDocketRecordEntry');
const { PublicDocument } = require('./PublicDocument');

/**
 * Public Case Entity
 * Represents the view of the public case.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function PublicCase(rawCase, { applicationContext }) {
  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId;
  this.createdAt = rawCase.createdAt;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.receivedAt = rawCase.receivedAt;
  this.isSealed = !!rawCase.sealedDate;

  this.contactPrimary = rawCase.contactPrimary
    ? new PublicContact(rawCase.contactPrimary)
    : undefined;
  this.contactSecondary = rawCase.contactSecondary
    ? new PublicContact(rawCase.contactSecondary)
    : undefined;

  // rawCase.docketRecord is not returned in elasticsearch queries due to _source definition
  this.docketRecord = (rawCase.docketRecord || []).map(
    entry => new PublicDocketRecordEntry(entry, { applicationContext }),
  );

  // rawCase.documents is not returned in elasticsearch queries due to _source definition
  this.documents = (rawCase.documents || [])
    .map(document => new PublicDocument(document, { applicationContext }))
    .filter(document => !isDraftDocument(document, this.docketRecord))
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

const publicCaseSchema = {
  caseCaption: joi.string().optional(),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .optional(),
  createdAt: joi.date().iso().optional(),
  docketNumber: joi.string().optional(),
  docketNumberSuffix: joi.string().allow(null).optional(),
  isSealed: joi.boolean(),
  receivedAt: joi.date().iso().optional(),
};
const sealedCaseSchemaRestricted = {
  caseCaption: joi.any().forbidden(),
  caseId: joi.string(),
  contactPrimary: joi.any().forbidden(),
  contactSecondary: joi.any().forbidden(),
  createdAt: joi.any().forbidden(),
  docketNumber: joi.string().required(),
  docketNumberSuffix: joi.string().optional(),
  docketRecord: joi.array().max(0),
  documents: joi.array().max(0),
  isSealed: joi.boolean(),
  receivedAt: joi.any().forbidden(),
};

joiValidationDecorator(
  PublicCase,
  joi.object(publicCaseSchema).when(joi.object({ isSealed: true }).unknown(), {
    then: joi.object(sealedCaseSchemaRestricted),
  }),
  {},
);

const isDraftDocument = function (document, docketRecord) {
  const orderDocumentTypes = map(Order.ORDER_TYPES, 'documentType');
  const courtIssuedDocumentTypes = map(
    Document.COURT_ISSUED_EVENT_CODES,
    'documentType',
  );

  const isStipDecision = document.documentType === 'Stipulated Decision';
  const isOrder = orderDocumentTypes.includes(document.documentType);
  const isCourtIssuedDocument = courtIssuedDocumentTypes.includes(
    document.documentType,
  );
  const isDocumentOnDocketRecord = docketRecord.find(
    docketEntry => docketEntry.documentId === document.documentId,
  );

  const isPublicDocumentType =
    isStipDecision || isOrder || isCourtIssuedDocument;

  return isPublicDocumentType && !isDocumentOnDocketRecord;
};

const isPrivateDocument = function (document, docketRecord) {
  const orderDocumentTypes = map(Order.ORDER_TYPES, 'documentType');
  const courtIssuedDocumentTypes = map(
    Document.COURT_ISSUED_EVENT_CODES,
    'documentType',
  );

  const isStipDecision = document.documentType === 'Stipulated Decision';
  const isTranscript = document.eventCode === Document.TRANSCRIPT_EVENT_CODE;
  const isOrder = orderDocumentTypes.includes(document.documentType);
  const isCourtIssuedDocument = courtIssuedDocumentTypes.includes(
    document.documentType,
  );
  const isDocumentOnDocketRecord = docketRecord.find(
    docketEntry => docketEntry.documentId === document.documentId,
  );

  const isPublicDocumentType =
    (isStipDecision || isOrder || isCourtIssuedDocument) && !isTranscript;

  return (
    (isPublicDocumentType && !isDocumentOnDocketRecord) || !isPublicDocumentType
  );
};

module.exports = { PublicCase, isDraftDocument, isPrivateDocument };
