import { state } from 'cerebral';

/**
 * clears the state.judgeActivityReportData
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearJudgeActivityReportResultAction = ({ store }) => {
  store.set(state.judgeActivityReportData, {});
};
