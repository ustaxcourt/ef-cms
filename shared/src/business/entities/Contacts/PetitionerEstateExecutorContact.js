const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerEstateExecutorContact(raw) {
  Object.assign(this, raw);
}

PetitionerEstateExecutorContact.errorToMessageMap = {
  name: 'Name is a required field.',
  title: 'Title is a required field.',
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
  PetitionerEstateExecutorContact,
  joi.object().keys({
    name: joi.string().required(),
    title: joi.string().optional(),
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
  PetitionerEstateExecutorContact.errorToMessageMap,
);

module.exports = PetitionerEstateExecutorContact;
