const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerTaxpayerContact(raw) {
  Object.assign(this, raw);
}

PetitionerTaxpayerContact.errorToMessageMap = {
  name: 'Name of Taxpayer is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  phone: 'Phone is a required field.',
};

joiValidationDecorator(
  PetitionerTaxpayerContact,
  joi.object().keys({
    name: joi.string().required(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    phone: joi.string().required(),
  }),
  undefined,
  PetitionerTaxpayerContact.errorToMessageMap,
);

module.exports = PetitionerTaxpayerContact;
