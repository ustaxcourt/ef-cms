import { CONTACT_TYPES } from '../entities/EntityConstants';
import { isEmpty } from 'lodash';
import { Petitioner } from '../entities/contacts/Petitioner';
import { UpdateUserEmail } from '../entities/UpdateUserEmail';

/**
 * validatePetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */
export const validatePetitionerInteractor = (
  applicationContext,
  {
    contactInfo,
    existingPetitioners,
  }: { contactInfo: any; existingPetitioners?: any[] },
) => {
  const contactErrors = new Petitioner(contactInfo, {
    applicationContext,
  }).getFormattedValidationErrors();

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

  let firstIntervenorId;
  existingPetitioners?.forEach(petitioner => {
    if (petitioner.contactType === CONTACT_TYPES.intervenor) {
      firstIntervenorId = petitioner.contactId;
    }
  });

  if (
    firstIntervenorId &&
    firstIntervenorId !== contactInfo.contactId &&
    contactInfo.contactType === CONTACT_TYPES.intervenor
  ) {
    aggregatedErrors.contactType =
      Petitioner.VALIDATION_ERROR_MESSAGES.contactTypeSecondIntervenor;
  }

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
