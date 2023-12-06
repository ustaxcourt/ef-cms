import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSession.eligibleCases with the updated case's qcCompleteForTrial value
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.eligibleCases
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 */
export const setQcCompleteOnCaseOnTrialSessionAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { updatedCase } = props;

  const eligibleCases = get(state.trialSession.eligibleCases);

  const eligibleCase = eligibleCases.find(
    myCase => myCase.docketNumber === updatedCase.docketNumber,
  );

  eligibleCase.qcCompleteForTrial = updatedCase.qcCompleteForTrial;

  store.set(state.trialSession.eligibleCases, eligibleCases);
};
