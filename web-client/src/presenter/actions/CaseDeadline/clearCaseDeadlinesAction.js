import { state } from 'cerebral';

/**
 * clears state.caseDeadlineReport.caseDeadlines and page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const clearCaseDeadlinesAction = ({ store }) => {
  store.unset(state.caseDeadlineReport.caseDeadlines);
  store.unset(state.caseDeadlineReport.page);
};
