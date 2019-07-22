const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseInternal Entity
 * Represents a Case with required documents that a Petitions Clerk is attempting to add to the system.
 * @param rawCase
 * @constructor
 */
function CaseInternal(rawCase) {
  this.caseCaption = rawCase.caseCaption;
  this.caseType = rawCase.caseType;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt;
  this.requestForPlaceOfTrialFile = rawCase.requestForPlaceOfTrialFile;
  this.requestForPlaceOfTrialFileSize = rawCase.requestForPlaceOfTrialFileSize;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

CaseInternal.errorToMessageMap = {
  caseCaption: 'Case Caption is required.',
  caseType: 'Case Type is a required field.',
  ownershipDisclosureFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Ownership Disclosure Statement file size is empty.',
  ],
  partyType: 'Party Type is a required field.',
  petitionFile: 'The Petition file was not selected.',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty.',
  ],
  procedureType: 'Procedure Type is a required field.',
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The received date is in the future. Please enter a valid date.',
    },
    'Please enter a valid date.',
  ],
  requestForPlaceOfTrialFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Request for Place of Trial file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Request for Place of Trial file size is empty.',
  ],
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty.',
  ],
};

const paperRequirements = joi.object().keys({
  caseCaption: joi.string().required(),
  caseType: joi.string().required(),
  ownershipDisclosureFile: joi.object().optional(),
  ownershipDisclosureFileSize: joi.when('ownershipDisclosureFile', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  partyType: joi.string().required(),
  petitionFile: joi.object().required(),
  petitionFileSize: joi.when('petitionFile', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  procedureType: joi.string().required(),
  receivedAt: joi
    .date()
    .iso()
    .max('now')
    .required(),
  requestForPlaceOfTrialFile: joi.object().optional(),
  requestForPlaceOfTrialFileSize: joi.when('requestForPlaceOfTrialFile', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
  stinFile: joi.object().optional(),
  stinFileSize: joi.when('stinFile', {
    is: joi.exist().not(null),
    otherwise: joi.optional().allow(null),
    then: joi
      .number()
      .required()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  }),
});

joiValidationDecorator(
  CaseInternal,
  paperRequirements,
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseInternal.errorToMessageMap,
);

module.exports = { CaseInternal };
