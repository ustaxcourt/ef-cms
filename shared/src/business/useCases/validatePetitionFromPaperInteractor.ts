import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { PaperPetition } from '../entities/cases/PaperPetition';

/**
 * validatePetitionFromPaper
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
export const validatePetitionFromPaperInteractor = (
  authorizedUser: AuthUser,
  { petition }: { petition: any },
) => {
  const errors = new PaperPetition(petition, {
    authorizedUser,
  }).getFormattedValidationErrors();
  return errors || null;
};
