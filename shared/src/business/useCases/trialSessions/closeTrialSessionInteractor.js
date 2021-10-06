const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { isEmpty, isEqual } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

// /**
//  * closeTrialSessionInteractor
//  *
//  * @param {object} applicationContext the application context
//  * @param {object} providers the providers object
//  * @param {string} providers.docketNumber the docket number of the case to remove from trial
//  * @param {string} providers.disposition the reason the case is being removed from trial
//  * @param {string} providers.trialSessionId the id of the trial session containing the case to set to removedFromTrial
//  * @returns {Promise} the promise of the getCalendaredCasesForTrialSession call
//  */
exports.closeTrialSessionInteractor = async (
  applicationContext,
  { trialSessionId },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (
    trialSession.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error(
      'Trial session cannot be closed until after its start date',
    );
  }

  const allCases = trialSession.caseOrder || [];
  const inactiveCases = allCases.filter(
    sessionCase => sessionCase.removedFromTrial === true,
  );

  if (!isEmpty(allCases) || !isEqual(allCases, inactiveCases)) {
    throw new Error('Trial session cannot be closed with open cases');
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.setAsClosed();

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
