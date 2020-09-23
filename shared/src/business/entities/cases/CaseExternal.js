const joi = require('joi');
const {
  BUSINESS_TYPES,
  FILING_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  MAX_FILE_SIZE_BYTES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
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
function CaseExternal() {}
CaseExternal.prototype.init = function init(rawCase, { applicationContext }) {
  CaseExternal.prototype.initSelf.call(this, rawCase, { applicationContext });
  CaseExternal.prototype.initContacts.call(this, rawCase, {
    applicationContext,
  });
};

CaseExternal.prototype.initContacts = function (
  rawCase,
  { applicationContext },
) {
  const contacts = ContactFactory.createContacts({
    applicationContext,
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
};

CaseExternal.prototype.initSelf = function (rawCase) {
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
  businessType: JoiValidationConstants.STRING.valid(
    ...Object.values(BUSINESS_TYPES),
  )
    .optional()
    .allow(null),
  caseType: JoiValidationConstants.STRING.when('hasIrsNotice', {
    is: joi.exist(),
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  contactPrimary: joi.object().optional(), // validated with the ContactFactory
  contactSecondary: joi.object().optional(), // validated with the ContactFactory
  countryType: JoiValidationConstants.STRING.optional(),
  filingType: JoiValidationConstants.STRING.valid(
    ...FILING_TYPES[ROLES.petitioner],
    ...FILING_TYPES[ROLES.privatePractitioner],
  ).required(),
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
  partyType: JoiValidationConstants.STRING.valid(
    ...Object.values(PARTY_TYPES),
  ).required(),
  petitionFile: joi.object().required(), // object of type File
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
      JoiValidationConstants.STRING.valid(
        ...TRIAL_CITY_STRINGS,
        ...LEGACY_TRIAL_CITY_STRINGS,
        null,
      ),
      JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
    )
    .required(),
  procedureType: JoiValidationConstants.STRING.valid(
    ...PROCEDURE_TYPES,
  ).required(),
  stinFile: joi.object().required(), // object of type File
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

module.exports = { CaseExternal: validEntityDecorator(CaseExternal) };
