const { CONTACT_TYPES } = require('../entities/EntityConstants');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { isEmpty } = require('lodash');
const { UpdateUserEmail } = require('../entities/UpdateUserEmail');

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.contact the contactInfo to validate
 * @param {object} providers.partyType the partyType to validate
 * @param {object} providers.status the case status to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateAddPetitionerInteractor = ({
  applicationContext,
  contact,
  partyType,
  status,
}) => {
  let contactInfo;

  if (contact.contactType === CONTACT_TYPES.secondary) {
    contactInfo = { [contact.contactType]: contact };
  } else {
    contactInfo = { [contact.contactType]: [contact] };
  }

  const contactErrors = ContactFactory.createContacts({
    applicationContext,
    contactInfo,
    partyType,
    status,
  })[contact.contactType].getFormattedValidationErrors();

  let updateUserEmailErrors;
  if (contact.updatedEmail || contact.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail(
      { ...contact, email: contact.updatedEmail },
      { applicationContext },
    ).getFormattedValidationErrors();
  }

  const aggregatedErrors = {
    ...contactErrors,
    ...updateUserEmailErrors,
  };

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
