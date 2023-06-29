import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears state.caseDeadlineReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the store object
 */
export const clearCaseDeadlineReportAction = ({ store }: ActionProps) => {
  store.set(state.caseDeadlineReport, {});
};
