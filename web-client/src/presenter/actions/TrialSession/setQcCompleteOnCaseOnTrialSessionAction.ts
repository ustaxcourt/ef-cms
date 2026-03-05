import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.trialSession.eligibleCases with the updated case's qcCompleteForTrial value
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.docketNumber, props.qcCompleteForTrial, and props.trialSessionId
 * @param {object} providers.store the cerebral store used for setting the state.eligibleCases
 */
export const setQcCompleteOnCaseOnTrialSessionAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { docketNumber, qcCompleteForTrial, trialSessionId } = props;

  const eligibleCases = get(state.trialSession.eligibleCases);

  const eligibleCase = eligibleCases.find(
    myCase => myCase.docketNumber === docketNumber,
  );

  if (eligibleCase) {
    if (!eligibleCase.qcCompleteForTrial) {
      eligibleCase.qcCompleteForTrial = {};
    }
    eligibleCase.qcCompleteForTrial[trialSessionId] = qcCompleteForTrial;
  }

  store.set(state.trialSession.eligibleCases, eligibleCases);
};
