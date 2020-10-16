import { state } from 'cerebral';

/**
 * clears state.caseDeadlineReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const clearCaseDeadlineReportAction = async ({ store }) => {
  store.set(state.caseDeadlineReport, {});
};
