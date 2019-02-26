const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const {
  getValidationObject,
  getErrorToMessageMap,
} = require('./PetitionContact');

exports.getPetitionerConservatorContact = ({ countryType }) => {
  function PetitionerConservatorContact(raw) {
    Object.assign(this, raw);
  }

  PetitionerConservatorContact.errorToMessageMap = {
    ...getErrorToMessageMap({ countryType }),
    name: 'Name of Conservator is a required field.',
  };

  joiValidationDecorator(
    PetitionerConservatorContact,
    joi.object().keys({
      ...getValidationObject({ countryType }),
    }),
    undefined,
    PetitionerConservatorContact.errorToMessageMap,
  );

  return PetitionerConservatorContact;
};
