const joi = require('@hapi/joi');
const {
  FILING_TYPES,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('../EntityConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternal Entity
 * Represents a Case with required documents that a Petitioner is attempting to add to the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseExternal(rawCase) {
  CaseExternal.prototype.init.call(this, rawCase);
  CaseExternal.prototype.initContacts.call(this, rawCase);
}

CaseExternal.prototype.initContacts = function (rawCase) {
  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
};

CaseExternal.prototype.init = function (rawCase) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;
};

CaseExternal.VALIDATION_ERROR_MESSAGES = Case.VALIDATION_ERROR_MESSAGES;

CaseExternal.commonRequirements = {
  businessType: joi.string().optional().allow(null), // TODO: enum
  caseType: joi.string().when('hasIrsNotice', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  contactPrimary: joi.object().optional(), // TODO: object definition
  contactSecondary: joi.object().optional(), // TODO: object definition
  countryType: joi.string().optional(),
  filingType: joi
    .string()
    .valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    )
    .required(),
  hasIrsNotice: joi.boolean().required(),
  ownershipDisclosureFile: joi.object().when('filingType', {
    is: 'A business',
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  ownershipDisclosureFileSize: joi
    .number()
    .integer()
    .min(1)
    .max(MAX_FILE_SIZE_BYTES)
    .when('ownershipDisclosureFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
  partyType: joi
    .string()
    .valid(...Object.values(PARTY_TYPES))
    .required(),
  petitionFile: joi.object().required(), // TODO: object definition
  petitionFileSize: joi
    .number()
    .integer()
    .min(1)
    .max(MAX_FILE_SIZE_BYTES)
    .when('petitionFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
  preferredTrialCity: joi
    .alternatives()
    .try(
      joi.string().valid(...TRIAL_CITY_STRINGS, null),
      joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
    )
    .required(),
  procedureType: joi
    .string()
    .valid(...PROCEDURE_TYPES)
    .required(),
  stinFile: joi.object().required(), // TODO: object definition
  stinFileSize: joi
    .number()
    .integer()
    .min(1)
    .max(MAX_FILE_SIZE_BYTES)
    .when('stinFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
};

joiValidationDecorator(
  CaseExternal,
  joi.object().keys(CaseExternal.commonRequirements),
  CaseExternal.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseExternal };
