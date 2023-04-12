import { state } from 'cerebral';

/**
 * Sets judgeActivityReportData on state
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setJudgeActivityReportDataAction = async ({ props, store }) => {
  const { casesClosedByJudge } = props;

  store.set(
    state.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );
};
