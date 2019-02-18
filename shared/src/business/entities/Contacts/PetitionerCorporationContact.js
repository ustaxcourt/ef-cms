const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerCorporationContact(raw) {
  Object.assign(this, raw);
}

PetitionerCorporationContact.errorToMessageMap = {
  name: 'Name is a required field.',
  inCareOf: 'In Care Of has errors.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
    'Zip Code is a required field.',
  ],
  phone: 'Phone is a required field.',
};

joiValidationDecorator(
  PetitionerCorporationContact,
  joi.object().keys({
    name: joi.string().required(),
    inCareOf: joi.string().optional(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .required(),
    phone: joi.string().required(),
  }),
  undefined,
  PetitionerCorporationContact.errorToMessageMap,
);

module.exports = PetitionerCorporationContact;
