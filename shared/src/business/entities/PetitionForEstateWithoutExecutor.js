const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionForEstateWithoutExecutor(rawPetition) {
  Object.assign(this, rawPetition);
}

PetitionForEstateWithoutExecutor.errorToMessageMap = {
  nameOfDecedent: 'Name of Decedent is a required field',
  address1: 'Address is a required field',
  inCareOf: 'In Care Of is a required field',
};

joiValidationDecorator(
  PetitionForEstateWithoutExecutor,
  joi.object().keys({
    contactPrimary: joi
      .object()
      .keys({
        nameOfDecedent: joi.string().required(),
        address1: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
        country: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string().required(),
        inCareOf: joi.string().required(),
      })
      .required(),
  }),
  undefined,
  PetitionForEstateWithoutExecutor.errorToMessageMap,
);

module.exports = PetitionForEstateWithoutExecutor;
