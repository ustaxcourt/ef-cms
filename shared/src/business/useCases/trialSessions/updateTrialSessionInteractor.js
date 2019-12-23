const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * updateTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
exports.updateTrialSessionInteractor = async ({
  applicationContext,
  trialSession,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: trialSession.trialSessionId,
    });

  if (
    currentTrialSession.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error('Trial session cannot be updated after its start date');
  }

  const newTrialSessionEntity = new TrialSession(
    { ...currentTrialSession, ...trialSession },
    {
      applicationContext,
    },
  );

  if (
    ((!currentTrialSession.judge || !currentTrialSession.judge.userId) &&
      newTrialSessionEntity.judge &&
      newTrialSessionEntity.judge.userId) ||
    (currentTrialSession.judge &&
      newTrialSessionEntity.judge &&
      currentTrialSession.judge.userId !== newTrialSessionEntity.judge.userId)
  ) {
    //create a working copy for the new judge
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: newTrialSessionEntity.trialSessionId,
      userId: newTrialSessionEntity.judge.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  if (currentTrialSession.caseOrder && currentTrialSession.caseOrder.length) {
    //update all the cases that are calendared with the new trial information
    const calendaredCases = currentTrialSession.caseOrder;

    for (let calendaredCase of calendaredCases) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByCaseId({
          applicationContext,
          caseId: calendaredCase.caseId,
        });

      const caseEntity = new Case(caseToUpdate, { applicationContext });
      caseEntity.setAsCalendared(newTrialSessionEntity);

      await applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      });
    }
  }

  const updatedTrialSession = await applicationContext
    .getPersistenceGateway()
    .updateTrialSession({
      applicationContext,
      trialSessionToUpdate: newTrialSessionEntity.validate().toRawObject(),
    });

  return updatedTrialSession;
};
