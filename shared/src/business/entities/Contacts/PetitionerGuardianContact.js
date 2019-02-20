const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerGuardianContact(raw) {
  Object.assign(this, raw);
}

PetitionerGuardianContact.errorToMessageMap = {
  name: 'Name of Guardian is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  phone: 'Phone is a required field.',
};

joiValidationDecorator(
  PetitionerGuardianContact,
  joi.object().keys({
    name: joi.string().required(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    phone: joi.string().required(),
  }),
  undefined,
  PetitionerGuardianContact.errorToMessageMap,
);

module.exports = PetitionerGuardianContact;
