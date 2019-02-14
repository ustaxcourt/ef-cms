const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerPrimaryContact(raw) {
  Object.assign(this, raw);
}

PetitionerPrimaryContact.errorToMessageMap = {
  name: 'Name is required',
  address1: 'Address is required',
  city: 'City is required',
  state: 'State is required',
  zip: 'Zip code is required',
  country: 'Country is required',
  phone: 'Phone number is required',
  email: 'Email is required',
};

joiValidationDecorator(
  PetitionerPrimaryContact,
  joi.object().keys({
    name: joi.string().required(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    country: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().required(),
  }),
  undefined,
  PetitionerPrimaryContact.errorToMessageMap,
);

module.exports = PetitionerPrimaryContact;
