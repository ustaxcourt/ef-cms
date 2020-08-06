const joi = require('joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
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
function CaseExternalIncomplete(rawCase, { applicationContext }) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.partyType = rawCase.partyType;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;

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
}

CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES =
  Case.VALIDATION_ERROR_MESSAGES;

joiValidationDecorator(
  CaseExternalIncomplete,
  joi.object().keys({
    businessType: CaseExternal.commonRequirements.businessType,
    caseType: CaseExternal.commonRequirements.caseType,
    contactPrimary: joi.object().optional(),
    contactSecondary: joi.object().optional(),
    countryType: CaseExternal.commonRequirements.countryType,
    filingType: CaseExternal.commonRequirements.filingType,
    hasIrsNotice: CaseExternal.commonRequirements.hasIrsNotice,
    partyType: CaseExternal.commonRequirements.partyType,
    preferredTrialCity: CaseExternal.commonRequirements.preferredTrialCity,
    procedureType: CaseExternal.commonRequirements.procedureType,
  }),
  CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseExternalIncomplete };
