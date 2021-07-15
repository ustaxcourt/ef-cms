import { state } from 'cerebral';

/**
 * sets judge filter on state.caseDeadlineReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCaseDeadlineReportJudgeFilterAction = ({ props, store }) => {
  store.set(state.caseDeadlineReport.judgeFilter, props.judge);
};
