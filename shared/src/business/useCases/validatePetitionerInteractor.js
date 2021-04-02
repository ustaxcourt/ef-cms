const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validatePetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.contactInfo the contact data
 * @param {object} providers.partyType the partyType of the case
 * @param {object} providers.petitioners the petitioners on the case
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

  const errors = ContactFactory.createContacts({
    applicationContext,
    contactInfo: { [petitioner.contactType]: contactInfo },
    partyType,
  })[petitioner.contactType].getFormattedValidationErrors();

  return errors;
};
