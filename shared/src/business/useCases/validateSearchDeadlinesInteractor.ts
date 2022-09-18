import { DeadlineSearch } from '../entities/deadlines/DeadlineSearch';

/**
 * validateSearchDeadlinesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.deadlineSearch the deadlineSearch params to validate
 * @returns {object} errors (null if no errors)
 */
export const validateSearchDeadlinesInteractor = (
  applicationContext,
  { deadlineSearch }: { deadlineSearch: any },
) => {
  const search = new DeadlineSearch(deadlineSearch, {
    applicationContext,
  });

  return search.getFormattedValidationErrors();
};
