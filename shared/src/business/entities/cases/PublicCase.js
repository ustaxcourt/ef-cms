const joi = require('joi');
const {
  COURT_ISSUED_DOCUMENT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  ORDER_TYPES,
  TRANSCRIPT_EVENT_CODE,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { compareStrings } = require('../../utilities/sortFunctions');
const { map } = require('lodash');
const { PublicContact } = require('./PublicContact');
const { PublicDocketEntry } = require('./PublicDocketEntry');

/**
 * Public Case Entity
 * Represents the view of the public case.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function PublicCase() {}
PublicCase.prototype.init = function init(rawCase, { applicationContext }) {
  this.caseCaption = rawCase.caseCaption;
  this.createdAt = rawCase.createdAt;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.docketNumberWithSuffix =
    rawCase.docketNumberWithSuffix ||
    `${this.docketNumber}${this.docketNumberSuffix || ''}`;
  this.receivedAt = rawCase.receivedAt;
  this.isSealed = !!rawCase.sealedDate;

  this.contactPrimary = rawCase.contactPrimary
    ? new PublicContact(rawCase.contactPrimary)
    : undefined;
  this.contactSecondary = rawCase.contactSecondary
    ? new PublicContact(rawCase.contactSecondary)
    : undefined;

  // rawCase.docketEntries is not returned in elasticsearch queries due to _source definition
  this.docketEntries = (rawCase.docketEntries || [])
    .filter(docketEntry => !docketEntry.isDraft && docketEntry.isOnDocketRecord)
    .map(
      docketEntry => new PublicDocketEntry(docketEntry, { applicationContext }),
    )
    .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
};

PublicCase.validationName = 'PublicCase';

const publicCaseSchema = {
  caseCaption: JoiValidationConstants.CASE_CAPTION.optional(),
  contactPrimary: PublicContact.VALIDATION_RULES.required(),
  contactSecondary: PublicContact.VALIDATION_RULES.optional().allow(null),
  createdAt: JoiValidationConstants.ISO_DATE.optional(),
  docketEntries: joi
    .array()
    .items(PublicDocketEntry.VALIDATION_RULES)
    .required()
    .description('List of DocketEntry Entities for the case.'),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  isSealed: joi.boolean(),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
};

const sealedCaseSchemaRestricted = {
  caseCaption: joi.any().forbidden(),
  contactPrimary: joi.any().forbidden(),
  contactSecondary: joi.any().forbidden(),
  createdAt: joi.any().forbidden(),
  docketEntries: joi.array().max(0),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  docketNumberSuffix: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCKET_NUMBER_SUFFIXES),
  ).optional(),
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

const isPrivateDocument = function (document) {
  const orderDocumentTypes = map(ORDER_TYPES, 'documentType');

  const isStipDecision = document.documentType === 'Stipulated Decision';
  const isTranscript = document.eventCode === TRANSCRIPT_EVENT_CODE;
  const isOrder = orderDocumentTypes.includes(document.documentType);
  const isDocumentOnDocketRecord = document.isOnDocketRecord;
  const isCourtIssuedDocument = COURT_ISSUED_DOCUMENT_TYPES.includes(
    document.documentType,
  );

  const isPublicDocumentType =
    (isStipDecision || isOrder || isCourtIssuedDocument) && !isTranscript;

  return (
    (isPublicDocumentType && !isDocumentOnDocketRecord) || !isPublicDocumentType
  );
};

module.exports = {
  PublicCase: validEntityDecorator(PublicCase),
  isPrivateDocument,
};
