import { CustomCaseInventorySearch } from '../entities/customCaseInventorySearch/CustomCaseInventorySearch';

/**
 * validateCustomCaseInventoryFiltersInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {string} providers.endDate the date to end the search for judge activity
 * @returns {object} errors (null if no errors)
 */
export const validateCustomCaseInventorySearchFiltersInteractor = (
  applicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  const customCaseInventorySearch = new CustomCaseInventorySearch({
    endDate,
    startDate,
  });

  return customCaseInventorySearch.getFormattedValidationErrors();
};
