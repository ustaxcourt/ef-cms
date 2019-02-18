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

function Petition(rawPetition) {
  Object.assign(this, rawPetition);

  if (this.filingType === 'Myself') {
    this.contactPrimary = new PetitionerPrimaryContact(
      this.contactPrimary || {},
    );
  }

  switch (this.partyType) {
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
    case 'Estate without Executor/Personal Representative/Etc.':
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
    case 'Estate with Executor/Personal Representative/Etc.':
      this.contactPrimary = new PetitionerEstateWithExecutorPrimaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerEstateExecutorContact(
        this.contactSecondary || {},
      );
      break;
    case 'Partnership (BBA Regime)':
    case 'Trust & Trustee':
    case 'Conservator':
    case 'Guardian':
    case 'Custodian':
      this.contactPrimary = new PetitionerIntermediaryContact(
        this.contactPrimary || {},
      );
      this.contactSecondary = new PetitionerPrimaryContact(
        this.contactSecondary || {},
      );
      break;
  }
}

Petition.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  irsNoticeDate: 'Notice Date is a required field.',
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
    businessType: joi.string().optional(),
    ownershipDisclosureFile: joi.object().when('businessType', {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    }),
    procedureType: joi.string().required(),
    filingType: joi.string().required(),
    preferredTrialCity: joi.string().required(),
    signature: joi.boolean().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  Petition.errorToMessageMap,
);

module.exports = Petition;
