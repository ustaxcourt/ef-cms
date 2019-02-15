const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
const PetitionerCorporationContact = require('./Contacts/PetitionerCorporationContact');
const PetitionerDeceasedSpouseContact = require('./Contacts/PetitionerDeceasedSpouseContact');
const PetitionerSpouseContact = require('./Contacts/PetitionerSpouseContact');

function Petition(rawPetition) {
  Object.assign(this, rawPetition);

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
  }
}

Petition.errorToMessageMap = {
  caseType: 'Case Type is a required field.',
  irsNoticeDate: 'IRS Notice Date is a required field.',
  petitionFile: 'The Petition file was not selected.',
  procedureType: 'Procedure Type is a required field.',
  filingType: 'Filing Type is a required field.',
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
