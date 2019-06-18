import { state } from 'cerebral';

/**
 * sets the state.trialSession.associatedCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.associatedCases
 * @param {object} providers.store the cerebral store used for setting the state.associatedCases
 */
export const setAssociatedCasesOnTrialSessionAction = ({ store, props }) => {
  store.set(state.trialSession.associatedCases, props.associatedCases);
};
