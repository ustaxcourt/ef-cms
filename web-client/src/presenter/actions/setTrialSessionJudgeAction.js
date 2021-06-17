import { state } from 'cerebral';

/**
 * sets the state.trialSessionJudge based on the props.caseDetail passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application contexts
 * @param {object} providers.store the cerebral store used for setting state.trialSessionJudge
 * @param {object} providers.props the cerebral props object used for getting the props.caseDetail
 */
export const setTrialSessionJudgeAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetail } = props;

  if (caseDetail && caseDetail.trialSessionId) {
    const { judge } = await applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: caseDetail.trialSessionId,
      });

    store.set(state.trialSessionJudge, judge || { name: 'Unassigned' });
  }
};
