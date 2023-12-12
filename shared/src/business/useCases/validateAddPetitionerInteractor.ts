import { CONTACT_TYPES } from '../entities/EntityConstants';
import { Petitioner } from '../entities/contacts/Petitioner';
import { isEmpty, some } from 'lodash';

/**
 * validateAddPetitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contact the contact to validate
 * @returns {object} errors (null if no errors)
 */
export const validateAddPetitionerInteractor = (
  applicationContext: IApplicationContext,
  {
    contact,
    existingPetitioners,
  }: { contact: any; existingPetitioners?: any[] },
) => {
  const petitionerErrors = new Petitioner(contact, {
    applicationContext,
  }).getFormattedValidationErrors();

  let caseCaptionError;
  if (!contact.caseCaption) {
    caseCaptionError = {
      caseCaption: 'Enter a case caption',
    };
  }

  const aggregatedErrors = {
    ...petitionerErrors,
    ...caseCaptionError,
  };

  if (
    some(existingPetitioners, { contactType: CONTACT_TYPES.intervenor }) &&
    contact.contactType === CONTACT_TYPES.intervenor
  ) {
    aggregatedErrors.contactType =
      'Only one (1) Intervenor is allowed per case. Please select a different Role.';
  }

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
