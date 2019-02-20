const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerTrustContact(raw) {
  Object.assign(this, raw);
}

PetitionerTrustContact.errorToMessageMap = {
  name: 'Name of Trust is a required field.',
  inCareOf: 'In Care Of has errors.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
  phone: 'Phone is a required field.',
};

joiValidationDecorator(
  PetitionerTrustContact,
  joi.object().keys({
    name: joi.string().required(),
    inCareOf: joi.string().optional(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi.string().required(),
    phone: joi.string().required(),
  }),
  undefined,
  PetitionerTrustContact.errorToMessageMap,
);

module.exports = PetitionerTrustContact;
