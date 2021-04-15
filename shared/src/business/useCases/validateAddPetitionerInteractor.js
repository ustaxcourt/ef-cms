const {
  getOtherPetitionerContact,
} = require('../entities/contacts/OtherPetitionerContact');

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contact the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddPetitionerInteractor = ({ applicationContext, contact }) => {
  const OtherPetitionerContact = getOtherPetitionerContact({
    countryType: contact.countryType,
    isPaper: false,
  });

  return new OtherPetitionerContact(contact, {
    applicationContext,
  }).getFormattedValidationErrors();
};
