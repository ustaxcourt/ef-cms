import { NewPractitioner } from '../../entities/NewPractitioner';

/**
 * validatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner metadata
 * @returns {object} errors
 */
export const validateAddPractitionerInteractor = (
  applicationContext: IApplicationContext,
  { practitioner },
) => {
  return new NewPractitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();
};
