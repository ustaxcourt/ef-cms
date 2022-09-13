import { CaseInternal } from '../entities/cases/CaseInternal';

/**
 * validatePetitionFromPaper
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
export const validatePetitionFromPaperInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  const errors = new CaseInternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
