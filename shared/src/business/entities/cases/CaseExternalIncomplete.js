const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternalIncomplete
 * Represents a Case without required documents that a Petitioner is attempting to add to the system.
 * After the Case's files have been saved, a Petition is created to include the document metadata.
 * @param rawCase
 * @constructor
 */
function CaseExternalIncomplete(rawCase) {
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
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

joiValidationDecorator(
  CaseExternalIncomplete,
  joi.object().keys({
    businessType: joi
      .string()
      .optional()
      .allow(null),
    caseType: joi.when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.string().required(),
    }),
    countryType: joi.string().optional(),
    filingType: joi.string().required(),
    hasIrsNotice: joi.boolean().required(),
    partyType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Case.COMMON_ERROR_MESSAGES,
);

module.exports = { CaseExternalIncomplete };
