import { state } from 'cerebral';

/**
 * Sets state.judgeActivityReportData to an empty object
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearJudgeActivityReportResultAction = ({
  store,
}: ActionProps) => {
  store.set(state.judgeActivityReportData, {});
};
