import { CaseExternal } from '../entities/cases/CaseExternal';

/**
 * validatePetitionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.petition the petition data to validate
 * @returns {object} errors (null if no errors)
 */
export const validatePetitionInteractor = (
  applicationContext: IApplicationContext,
  { petition }: { petition: any },
) => {
  const errors = new CaseExternal(petition, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
