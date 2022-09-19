import { DocumentSearch } from '../entities/documents/DocumentSearch';

/**
 * validateOrderAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.orderSearch the order search to validate
 * @returns {object} errors (null if no errors)
 */
export const validateOrderAdvancedSearchInteractor = (
  applicationContext: IApplicationContext,
  { orderSearch }: { orderSearch: any },
) => {
  const search = new DocumentSearch(orderSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
