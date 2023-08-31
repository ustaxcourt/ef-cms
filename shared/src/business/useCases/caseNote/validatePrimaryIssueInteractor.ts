import { CaseWorksheet } from '../../entities/caseWorksheet/CaseWorksheet';

/**
 * validateNote
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.note the note object
 * @returns {object} the errors or null
 */
export const validatePrimaryIssueInteractor = (
  applicationContext: IApplicationContext,
  { primaryIssue }: { primaryIssue: { notes?: string } },
) => {
  const errors = new CaseWorksheet(primaryIssue, {
    applicationContext,
  }).getFormattedValidationErrors();
  if (!errors) return null;
  return errors;
};
