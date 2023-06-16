import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSession.eligibleCases
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.eligibleCases
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 */
export const setEligibleCasesOnTrialSessionAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.trialSession.eligibleCases, props.eligibleCases);
};
