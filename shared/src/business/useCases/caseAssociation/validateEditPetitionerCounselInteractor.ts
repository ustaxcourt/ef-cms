import { EditPetitionerCounselFactory } from '../../entities/caseAssociation/EditPetitionerCounselFactory';

/**
 * validateEditPetitionerCounselInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.practitioner the petitioner counsel to validate
 * @returns {object} errors
 */
export const validateEditPetitionerCounselInteractor = ({
  practitioner,
}: {
  practitioner: any;
}) => {
  return EditPetitionerCounselFactory(
    practitioner,
  ).getFormattedValidationErrors();
};
