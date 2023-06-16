import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears state.caseDeadlineReport.caseDeadlines and page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const clearCaseDeadlinesAction = ({ store }: ActionProps) => {
  store.unset(state.caseDeadlineReport.caseDeadlines);
  store.unset(state.caseDeadlineReport.page);
};
