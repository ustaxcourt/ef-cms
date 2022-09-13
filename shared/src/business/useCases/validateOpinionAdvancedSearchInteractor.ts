import { DocumentSearch } from '../entities/documents/DocumentSearch';

/**
 * validateOpinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.opinionSearch the opinion search to validate
 * @returns {object} errors (null if no errors)
 */
export const validateOpinionAdvancedSearchInteractor = (
  applicationContext: IApplicationContext,
  { opinionSearch }: { opinionSearch: any },
) => {
  const search = new DocumentSearch(opinionSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
