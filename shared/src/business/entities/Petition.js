const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
const PetitionerCorporationContact = require('./Contacts/PetitionerCorporationContact');
const PetitionerIntermediaryContact = require('./Contacts/PetitionerIntermediaryContact');
const PetitionerDeceasedSpouseContact = require('./Contacts/PetitionerDeceasedSpouseContact');
const PetitionerSpouseContact = require('./Contacts/PetitionerSpouseContact');
const PetitionerEstateExecutorContact = require('./Contacts/PetitionerEstateExecutorContact');
const PetitionerEstateWithExecutorPrimaryContact = require('./Contacts/PetitionerEstateWithExecutorPrimaryContact');
const PetitionerTaxpayerContact = require('./Contacts/PetitionerTaxpayerContact');
const PetitionerConservatorContact = require('./Contacts/PetitionerConservatorContact');
const PetitionerGuardianContact = require('./Contacts/PetitionerGuardianContact');
const PetitionerCustodianContact = require('./Contacts/PetitionerCustodianContact');
const PetitionerPartnershipRepContact = require('./Contacts/PetitionerPartnershipRepContact');
const PetitionerTrustContact = require('./Contacts/PetitionerTrustContact');
const PetitionerTrusteeContact = require('./Contacts/PetitionerTrusteeContact');

/**
 *
 * @param rawPetition
 * @constructor
 */
function Petition(rawPetition) {
  Object.assign(this, rawPetition);

  switch (this.partyType) {
    case 'Petitioner':
    case 'Transferee':
    case 'Donor':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      break;
    case 'Petitioner & Deceased Spouse':
    case 'Surviving Spouse':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerDeceasedSpouseContact(
        this.contactSecondary || {},
      );
      break;
    case 'Petitioner & Spouse':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerSpouseContact(
        this.contactSecondary || {},
      );
      break;
    case 'Corporation':
    case 'Estate without an Executor/Personal Representative/Fiduciary/etc.':
      this.contactPrimary = new PetitionerCorporationContact(
        this.contactPrimary || {},
      );
      break;
    case 'Partnership (as the tax matters partner)':
    case 'Partnership (as a partner other than tax matters partner)':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerCorporationContact(
        this.contactSecondary || {},
      );
      break;
    case 'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)':
    case 'Next Friend for an Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)':
      this.contactPrimary = new PetitionerPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerIntermediaryContact(
        this.contactSecondary || {},
      );
      break;
    case 'Estate with an Executor/Personal Representative/Fiduciary/etc.':
      this.contactPrimary = new PetitionerEstateWithExecutorPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerEstateExecutorContact(
        this.contactSecondary || {},
      );
      break;
    case 'Partnership (BBA Regime)':
      this.contactPrimary = new PetitionerIntermediaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerPartnershipRepContact(
        this.contactSecondary || {},
      );
      break;
    case 'Trust':
      this.contactPrimary = new PetitionerTrustContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTrusteeContact(
        this.contactSecondary || {},
      );
      break;
    case 'Conservator':
      this.contactPrimary = new PetitionerConservatorContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTaxpayerContact(
        this.contactSecondary || {},
      );
      break;
    case 'Guardian':
      this.contactPrimary = new PetitionerGuardianContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTaxpayerContact(
        this.contactSecondary || {},
      );
      break;
    case 'Custodian':
      this.contactPrimary = new PetitionerCustodianContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerTaxpayerContact(
        this.contactSecondary || {},
      );
      break;
  }
}

Petition.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  irsNoticeDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Notice Date is in the future. Please enter a valid date.',
    },
    'Notice Date is a required field.',
  ],
  petitionFile: 'The Petition file was not selected.',
  procedureType: 'Procedure Type is a required field.',
  filingType: 'Filing Type is a required field.',
  ownershipDisclosureFile: 'Ownership Disclosure Statement is required.',
  preferredTrialCity: 'Preferred Trial City is a required field.',
  signature: 'You must review the form before submitting.',
};

joiValidationDecorator(
  Petition,
  joi.object().keys({
    caseType: joi.string().required(),
    irsNoticeDate: joi
      .date()
      .max('now')
      .iso()
      .required(),
    petitionFile: joi.object().required(),
    businessType: joi
      .string()
      .optional()
      .allow(null),
    procedureType: joi.string().required(),
    filingType: joi.string().required(),
    ownershipDisclosureFile: joi.object().when('filingType', {
      is: 'A business',
      then: joi.required(),
      otherwise: joi.optional().allow(null),
    }),
    preferredTrialCity: joi.string().required(),
    signature: joi.boolean().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Petition.errorToMessageMap,
);

module.exports = Petition;
