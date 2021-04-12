const { ContactFactory } = require('../entities/contacts/ContactFactory');

/**
 * validatePetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contactInfo the contactInfo to validate
 * @param {object} providers.partyType the partyType to validate
 * @param {object} providers.petitioners the petitioners to validate
 * @param {object} providers.status the case status to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePetitionerInteractor = ({
  applicationContext,
  contactInfo,
  partyType,
  petitioners,
  status,
}) => {
  const petitioner = petitioners.find(
    p => p.contactId === contactInfo.contactId,
  );

  return ContactFactory.createContacts({
    applicationContext,
    contactInfo: { [petitioner.contactType]: contactInfo },
    partyType,
    status,
  })[petitioner.contactType].getFormattedValidationErrors();
};
