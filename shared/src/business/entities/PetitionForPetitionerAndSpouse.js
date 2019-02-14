const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const PetitionerPrimaryContact = require('./Contacts/PetitionerPrimaryContact');
const PetitionerSpouseContact = require('./Contacts/PetitionerSpouseContact');

function PetitionForPetitionerAndSpouse(rawPetition) {
  Object.assign(
    this,
    { contactPrimary: {}, contactSecondary: {} },
    rawPetition,
  );
  this.contactPrimary = new PetitionerPrimaryContact(this.contactPrimary);
  this.contactSecondary = new PetitionerSpouseContact(this.contactSecondary);
}

PetitionForPetitionerAndSpouse.errorToMessageMap = {
  contactPrimary: 'Primary Contact is required',
  contactSecondary: 'Primary Contact is required',
};

joiValidationDecorator(
  PetitionForPetitionerAndSpouse,
  joi.object().keys({
    contactPrimary: joi.object().required(),
    contactSecondary: joi.object().required(),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  PetitionForPetitionerAndSpouse.errorToMessageMap,
);

module.exports = PetitionForPetitionerAndSpouse;
