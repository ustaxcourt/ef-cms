import { Practitioner } from '../../entities/Practitioner';

/**
 * validatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner metadata
 * @returns {object} errors
 */
export const validatePractitionerInteractor = (
  applicationContext: IApplicationContext,
  { practitioner }: { practitioner: TPractitioner },
) => {
  const errors = new Practitioner(practitioner, {
    applicationContext,
  }).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
