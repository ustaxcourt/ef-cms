import { state } from 'cerebral';

/**
 * Sets data used to populate the tables for the judge activity report on state
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps) => {
  const { casesClosedByJudge, opinions, orders, trialSessions } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );
  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    trialSessions,
  );
  store.set(
    state.judgeActivityReport.judgeActivityReportData.opinions,
    opinions,
  );
  store.set(state.judgeActivityReport.judgeActivityReportData.orders, orders);
};
