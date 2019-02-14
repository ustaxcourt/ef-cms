const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

function PetitionForEstateWithExecutor(rawPetition) {
  Object.assign(this, rawPetition);
}

PetitionForEstateWithExecutor.errorToMessageMap = {
  nameOfExecutor: 'Name of Executor is a required field',
  address1: 'Address is a required field',
  nameOfDecedent: 'Name of Decedent is a required field',
};

joiValidationDecorator(
  PetitionForEstateWithExecutor,
  joi.object().keys({
    contactPrimary: joi
      .object()
      .keys({
        nameOfExecutor: joi.string().required(),
        title: joi.string().required(),
        address1: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
        country: joi.string().required(),
        email: joi.string().required(),
        phone: joi.string().required(),
      })
      .required(),

    contactSecondary: joi
      .object()
      .keys({
        nameOfDecedent: joi.string().required(),
        address1: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required(),
        zip: joi.string().required(),
        country: joi.string().required(),
      })
      .required(),
  }),
  undefined,
  PetitionForEstateWithExecutor.errorToMessageMap,
);

module.exports = PetitionForEstateWithExecutor;
