const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionerEstateWithExecutorPrimaryContact(raw) {
  Object.assign(this, raw);
}

PetitionerEstateWithExecutorPrimaryContact.errorToMessageMap = {
  name: 'Name is a required field.',
  address1: 'Address is a required field.',
  city: 'City is a required field.',
  state: 'State is a required field.',
  zip: 'Zip Code is a required field.',
};

joiValidationDecorator(
  PetitionerEstateWithExecutorPrimaryContact,
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
  PetitionerEstateWithExecutorPrimaryContact.errorToMessageMap,
);

module.exports = PetitionerEstateWithExecutorPrimaryContact;
