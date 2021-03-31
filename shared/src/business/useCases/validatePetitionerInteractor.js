const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validatePetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contact data
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionerInteractor = ({
  applicationContext,
  contactInfo,
  partyType,
  petitioners,
}) => {
  const petitioner = petitioners.find(
    p => p.contactId === contactInfo.contactId,
  );

  return ContactFactory.createContacts({
    applicationContext,
    contactInfo: { [petitioner.contactType]: contactInfo },
    partyType,
  })[petitioner.contactType].getFormattedValidationErrors();
};
