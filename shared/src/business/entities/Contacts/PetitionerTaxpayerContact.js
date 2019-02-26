const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const {
  getValidationObject,
  getErrorToMessageMap,
} = require('./PetitionContact');

exports.getPetitionerTaxpayerContact = ({ countryType }) => {
  function PetitionerTaxpayerContact(raw) {
    Object.assign(this, raw);
  }

  PetitionerTaxpayerContact.errorToMessageMap = {
    ...getErrorToMessageMap({ countryType }),
    name: 'Name of Taxpayer is a required field.',
  };

  joiValidationDecorator(
    PetitionerTaxpayerContact,
    joi.object().keys({
      ...getValidationObject({ countryType }),
    }),
    undefined,
    PetitionerTaxpayerContact.errorToMessageMap,
  );
  return PetitionerTaxpayerContact;
};
