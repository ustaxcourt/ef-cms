import { CONTACT_TYPES } from '../entities/EntityConstants';
import { Petitioner } from '../entities/contacts/Petitioner';
import { RawContact } from '../entities/contacts/Contact';
import { UpdateUserEmail } from '../entities/UpdateUserEmail';
import { isEmpty } from 'lodash';

/**
 * validatePetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactInfo the contactInfo to validate
 * @returns {object} errors (null if no errors)
 */

export const validatePetitionerInteractor = (
  applicationContext: IApplicationContext,
  {
    contactInfo,
    existingPetitioners,
  }: {
    contactInfo: RawContact & { updatedEmail?: string; confirmEmail?: string };
    existingPetitioners: TPetitioner[];
  },
) => {
  const contactErrors = new Petitioner(contactInfo, {
    applicationContext,
  }).getFormattedValidationErrors();

  let updateUserEmailErrors;
  if (contactInfo.updatedEmail || contactInfo.confirmEmail) {
    updateUserEmailErrors = new UpdateUserEmail({
      ...contactInfo,
      email: contactInfo.updatedEmail,
    }).getFormattedValidationErrors();
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
      'Only one (1) Intervenor is allowed per case. Please select a different Role.';
  }

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
