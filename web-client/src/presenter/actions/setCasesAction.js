import { state } from 'cerebral';

/**
 * sets the state.cases based on the props.caseList passed in
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting the state.cases
 * @param {Object} providers.props the cerebral props object used for passing the props.caseList
 */
export default ({ store, props }) => {
  store.set(state.cases, props.caseList);
};
