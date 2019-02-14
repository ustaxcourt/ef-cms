const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
const PetitionerDeceasedSpouseContact = require('./Contacts/PetitionerDeceasedSpouseContact');

function PetitionForPetitionerAndDeceasedSpouse(rawPetition) {
  Object.assign(
    this,
    { contactPrimary: {}, contactSecondary: {} },
    rawPetition,
  );
  this.contactPrimary = new PetitionerPrimaryContact(this.contactPrimary);
  this.contactSecondary = new PetitionerDeceasedSpouseContact(
    this.contactSecondary,
  );
}

PetitionForPetitionerAndDeceasedSpouse.errorToMessageMap = {
  contactPrimary: 'Primary Contact is required',
  contactSecondary: 'Primary Contact is required',
};

joiValidationDecorator(
  PetitionForPetitionerAndDeceasedSpouse,
  joi.object().keys({
    contactPrimary: joi.object().required(),
    contactSecondary: joi.object().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionForPetitionerAndDeceasedSpouse.errorToMessageMap,
);

module.exports = PetitionForPetitionerAndDeceasedSpouse;
