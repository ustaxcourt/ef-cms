import { AddPrivatePractitionerFactory } from '../../entities/caseAssociation/AddPrivatePractitionerFactory';

/**
 * validateAddPrivatePractitionerInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.counsel the practitioner to validate
 * @returns {object} errors
 */
export const validateAddPrivatePractitionerInteractor = ({
  counsel,
}: {
  counsel: any;
}) => {
  const errors =
    AddPrivatePractitionerFactory(counsel).getFormattedValidationErrors();

  if (!errors) return null;
  return errors;
};
