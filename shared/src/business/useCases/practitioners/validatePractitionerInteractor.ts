import { Practitioner, RawPractitioner } from '../../entities/Practitioner';

/**
 * validatePractitionerInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner metadata
 * @returns {object} errors
 */
export const validatePractitionerInteractor = ({
  practitioner,
}: {
  practitioner: RawPractitioner;
}) => {
  const errors = new Practitioner(practitioner).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
