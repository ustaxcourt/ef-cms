const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerPrimaryContact(raw) {
  Object.assign(this, raw);
}

PetitionerPrimaryContact.errorToMessageMap = {
  name: 'Name is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  // country: '',
  phone: 'Phone is a required field.',
  // email: '',
};

joiValidationDecorator(
  PetitionerPrimaryContact,
  joi.object().keys({
    name: joi.string().required(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    // country: joi.string().required(),
    phone: joi.string().required(),
    // email: joi.string().required(),
  }),
  undefined,
  PetitionerPrimaryContact.errorToMessageMap,
);

module.exports = PetitionerPrimaryContact;
