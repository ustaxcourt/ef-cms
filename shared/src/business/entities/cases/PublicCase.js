const joi = require('joi');
const {
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_SUFFIXES,
  ORDER_TYPES,
  PARTY_TYPES,
  ROLES,
  STIPULATED_DECISION_EVENT_CODE,
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
const { ContactFactory } = require('../contacts/ContactFactory');
const { IrsPractitioner } = require('../IrsPractitioner');
const { isSealedCase } = require('./Case');
const { map } = require('lodash');
const { PrivatePractitioner } = require('../PrivatePractitioner');
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
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.docketNumberWithSuffix =
    rawCase.docketNumberWithSuffix ||
    `${this.docketNumber}${this.docketNumberSuffix || ''}`;
  this.hasIrsPractitioner =
    !!rawCase.irsPractitioners && rawCase.irsPractitioners.length > 0;
  this.partyType = rawCase.partyType;
  this.receivedAt = rawCase.receivedAt;
  this._score = rawCase['_score'];

  this.isSealed = isSealedCase(rawCase);

  const currentUser = applicationContext.getCurrentUser();

  if (currentUser.role === ROLES.irsPractitioner && !this.isSealed) {
    const contacts = ContactFactory.createContacts({
      applicationContext,
      contactInfo: {
        otherFilers: rawCase.otherFilers,
        otherPetitioners: rawCase.otherPetitioners,
        primary: rawCase.contactPrimary,
        secondary: rawCase.contactSecondary,
      },
      isPaper: rawCase.isPaper,
      partyType: rawCase.partyType,
    });

    this.otherPetitioners = contacts.otherPetitioners;
    this.otherFilers = contacts.otherFilers;
    this.contactPrimary = contacts.primary;
    this.contactSecondary = contacts.secondary;

    this.irsPractitioners = (rawCase.irsPractitioners || []).map(
      irsPractitioner => new IrsPractitioner(irsPractitioner),
    );
    this.privatePractitioners = (rawCase.privatePractitioners || []).map(
      practitioner => new PrivatePractitioner(practitioner),
    );
  } else {
    this.contactPrimary = rawCase.contactPrimary
      ? new PublicContact(rawCase.contactPrimary)
      : undefined;
    this.contactSecondary = rawCase.contactSecondary
      ? new PublicContact(rawCase.contactSecondary)
      : undefined;
  }

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
  hasIrsPractitioner: joi.boolean().required(),
  isSealed: joi.boolean(),
  partyType: JoiValidationConstants.STRING.valid(...Object.values(PARTY_TYPES))
    .required()
    .description('Party type of the case petitioner.'),
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
  hasIrsPractitioner: joi.boolean(),
  isSealed: joi.boolean(),
  partyType: joi.any().forbidden(),
  receivedAt: joi.any().forbidden(),
};

joiValidationDecorator(
  PublicCase,
  joi.object(publicCaseSchema).when(joi.object({ isSealed: true }).unknown(), {
    then: joi.object(sealedCaseSchemaRestricted),
  }),
  {},
);

const isPrivateDocument = function (documentEntity) {
  const orderDocumentTypes = map(ORDER_TYPES, 'documentType');

  const isStipDecision =
    documentEntity.eventCode === STIPULATED_DECISION_EVENT_CODE;
  const isTranscript = documentEntity.eventCode === TRANSCRIPT_EVENT_CODE;
  const isOrder = orderDocumentTypes.includes(documentEntity.documentType);
  const isDocumentOnDocketRecord = documentEntity.isOnDocketRecord;
  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(documentEntity.eventCode);
  const documentIsStricken = !!documentEntity.isStricken;

  const isPublicDocumentType =
    (isOrder || isCourtIssuedDocument) &&
    !isTranscript &&
    !isStipDecision &&
    !documentIsStricken;

  return (
    (isPublicDocumentType && !isDocumentOnDocketRecord) || !isPublicDocumentType
  );
};

module.exports = {
  PublicCase: validEntityDecorator(PublicCase),
  isPrivateDocument,
};
