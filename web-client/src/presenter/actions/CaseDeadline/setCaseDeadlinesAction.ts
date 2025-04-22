import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.caseDeadlineReport based on the props passed in
 *
 * @param {object} providers the providers object
 * @param {function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCaseDeadlinesAction = ({ props, store }: ActionProps) => {
  store.set(
    state.caseDeadlineReport.caseDeadlinesForCurrentPage,
    props.caseDeadlines,
  );
  store.set(state.caseDeadlineReport.caseDeadlinesTotalCount, props.totalCount);
};
