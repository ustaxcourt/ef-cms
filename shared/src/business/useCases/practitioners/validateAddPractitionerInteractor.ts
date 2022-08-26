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
  { practitioner }: { practitioner: TPractitioner },
) => {
  const errors = new NewPractitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
