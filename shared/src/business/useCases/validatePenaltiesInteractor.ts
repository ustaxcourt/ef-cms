import { CONTACT_TYPES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
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
export const validatePenaltiesInteractor = (
  applicationContext: IApplicationContext,
  { rawPenalty }: { rawPenalty: object },
) => {
  const petitionerErrors = new Petitioner(contact, {
    applicationContext,
  }).getFormattedValidationErrors();

  let caseCaptionError;
  if (!contact.caseCaption) {
    caseCaptionError = {
      caseCaption: Case.VALIDATION_ERROR_MESSAGES.caseCaption,
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
      Petitioner.VALIDATION_ERROR_MESSAGES.contactTypeSecondIntervenor;
  }

  return !isEmpty(aggregatedErrors) ? aggregatedErrors : undefined;
};
