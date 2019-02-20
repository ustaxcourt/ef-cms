const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerDeceasedSpouseContact(raw) {
  Object.assign(this, raw);
}

PetitionerDeceasedSpouseContact.errorToMessageMap = {
  name: 'Name is required',
  address1: 'Address is required',
  city: 'City is required',
  state: 'State is required',
  zip: [
    {
      contains: 'match',
      message: 'Please enter a valid zip code.',
    },
    'Zip Code is a required field.',
  ],
};

joiValidationDecorator(
  PetitionerDeceasedSpouseContact,
  joi.object().keys({
    name: joi.string().required(),
    address1: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    zip: joi
      .string()
      .regex(/^\d{5}(-\d{4})?$/)
      .required(),
  }),
  undefined,
  PetitionerDeceasedSpouseContact.errorToMessageMap,
);

module.exports = PetitionerDeceasedSpouseContact;
