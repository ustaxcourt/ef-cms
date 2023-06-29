import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the trial sessions using the getTrialSessions use case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.get the cerebral get function for fetching state variables
 * @param {object} providers.store the cerebral store used for setting state variables
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsOnCaseAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  let trialSessions = [];

  if (caseDetail && caseDetail.trialSessionId) {
    const trialSession = await applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor(applicationContext, {
        trialSessionId: caseDetail.trialSessionId,
      });

    trialSessions.push(trialSession);

    store.set(
      state.trialSessionJudge,
      trialSession.judge || { name: 'Unassigned' },
    );
  }

  trialSessions = [
    ...trialSessions,
    ...(await Promise.all(
      caseDetail.hearings.map(hearing =>
        applicationContext
          .getUseCases()
          .getTrialSessionDetailsInteractor(applicationContext, {
            trialSessionId: hearing.trialSessionId,
          }),
      ),
    )),
  ];

  return { trialSessions };
};
