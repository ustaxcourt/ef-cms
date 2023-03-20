const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { Case, getContactPrimary, getContactSecondary } = require('./Case');
const { CaseExternal } = require('./CaseExternal');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternalIncomplete
 * Represents a Case without required documents that a Petitioner is attempting to add to the system.
 * After the Case's files have been saved, a Petition is created to include the document metadata.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseExternalIncomplete() {}
CaseExternalIncomplete.prototype.init = function init(
  rawCase,
  { applicationContext },
) {
  CaseExternalIncomplete.prototype.initSelf.call(this, rawCase, {
    applicationContext,
  });
  CaseExternalIncomplete.prototype.initContacts.call(this, rawCase, {
    applicationContext,
  });
};

CaseExternalIncomplete.prototype.initContacts = function (
  rawCase,
  { applicationContext },
) {
  const contacts = ContactFactory.createContacts({
    applicationContext,
    contactInfo: {
      primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
      secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.petitioners = [];
  this.petitioners.push(contacts.primary);
  if (contacts.secondary) {
    this.petitioners.push(contacts.secondary);
  }
};

CaseExternalIncomplete.prototype.initSelf = function (rawCase) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.partyType = rawCase.partyType;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
};

CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES =
  Case.VALIDATION_ERROR_MESSAGES;

joiValidationDecorator(
  CaseExternalIncomplete,
  joi.object().keys({
    businessType: CaseExternal.commonRequirements.businessType,
    caseType: CaseExternal.commonRequirements.caseType,
    countryType: CaseExternal.commonRequirements.countryType,
    filingType: CaseExternal.commonRequirements.filingType,
    hasIrsNotice: CaseExternal.commonRequirements.hasIrsNotice,
    partyType: CaseExternal.commonRequirements.partyType,
    petitioners: joi
      .array()
      .description('List of Contact Entities for the case.')
      .optional(),
    preferredTrialCity: CaseExternal.commonRequirements.preferredTrialCity,
    procedureType: CaseExternal.commonRequirements.procedureType,
  }),
  CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES,
);

/**
 * Returns the primary contact on the case
 *
 * @returns {Object} the primary contact object on the case
 */
CaseExternalIncomplete.prototype.getContactPrimary = function () {
  return getContactPrimary(this);
};

/**
 * Retrieves the secondary contact on the case
 *
 * @returns {Object} the secondary contact object on the case
 */
CaseExternalIncomplete.prototype.getContactSecondary = function () {
  return getContactSecondary(this);
};

module.exports = {
  CaseExternalIncomplete: validEntityDecorator(CaseExternalIncomplete),
};
