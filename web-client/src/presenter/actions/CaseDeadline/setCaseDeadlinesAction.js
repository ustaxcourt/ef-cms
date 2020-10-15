import { state } from 'cerebral';

/**
 * sets the state.allCaseDeadlines
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDeadlines
 * @param {object} providers.store the cerebral store used for setting the state.allCaseDeadlines
 */
export const setCaseDeadlinesAction = ({ get, props, store }) => {
  let caseDeadlines = get(state.caseDeadlineReport.caseDeadlines);
  if (caseDeadlines) {
    caseDeadlines.push(...props.caseDeadlines);
  } else {
    ({ caseDeadlines } = props);
  }
  store.set(state.caseDeadlineReport.caseDeadlines, caseDeadlines);
  store.set(state.caseDeadlineReport.totalCount, props.totalCount);

  const page = get(state.caseDeadlineReport.page) || 1;
  store.set(state.caseDeadlineReport.page, page + 1);
};
