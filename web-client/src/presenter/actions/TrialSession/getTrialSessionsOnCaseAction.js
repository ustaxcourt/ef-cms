import { state } from 'cerebral';

/**
 * Fetches the trial sessions using the getTrialSessions use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsOnCaseAction = async ({
  applicationContext,
  get,
  store,
}) => {
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
