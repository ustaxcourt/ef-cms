const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { isEmpty } = require('lodash');
const { UpdateUserEmail } = require('../entities/UpdateUserEmail');

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
  let petitioner = petitioners.find(p => p.contactId === contactInfo.contactId);

  if (!petitioner) {
    petitioner = contactInfo;
  }

  const contactErrors = ContactFactory.createContacts({
    applicationContext,
    contactInfo: { [petitioner.contactType]: contactInfo },
    partyType,
    status,
  })[petitioner.contactType].getFormattedValidationErrors();

  let updateUserEmailErrors;
  if (contactInfo.updatedEmail || contactInfo.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail(
      { ...contactInfo, email: contactInfo.updatedEmail },
      { applicationContext },
    ).getFormattedValidationErrors();
  }

  const aggregatedErrors = {
    ...contactErrors,
    ...updateUserEmailErrors,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
