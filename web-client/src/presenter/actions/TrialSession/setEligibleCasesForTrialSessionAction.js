import { state } from 'cerebral';

/**
 * sets the state.eligibleCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.eligibleCases
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 */
export const setEligibleCasesForTrialSessionAction = ({ store, props }) => {
  store.set(state.eligibleCases, props.eligibleCases);
};
