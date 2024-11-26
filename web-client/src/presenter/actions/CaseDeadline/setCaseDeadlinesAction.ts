import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.caseDeadlineReport based on the props passed in
 *
 * @param {object} providers the providers object
 * @param {function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCaseDeadlinesAction = ({ get, props, store }: ActionProps) => {
  let caseDeadlines = get(state.caseDeadlineReport.caseDeadlines);
  if (caseDeadlines) {
    caseDeadlines.push(...props.caseDeadlines);
  } else {
    ({ caseDeadlines } = props);
  }
  store.set(state.caseDeadlineReport.caseDeadlines, caseDeadlines);
};
