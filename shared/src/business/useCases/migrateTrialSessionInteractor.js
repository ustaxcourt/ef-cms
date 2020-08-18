const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { TrialSession } = require('../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionMetadata the trial session metadata
 * @returns {object} the created trial session
 */
exports.migrateTrialSessionInteractor = async ({
  applicationContext,
  trialSessionMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MIGRATE_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!trialSessionMetadata.trialSessionId) {
    throw new Error('Migrated trial session data must include trialSessionId');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const trialSessionToAdd = new TrialSession(
    {
      ...trialSessionMetadata,
      userId: user.userId,
    },
    {
      applicationContext,
    },
  );

  const trialSessionValidatedRaw = trialSessionToAdd.validate().toRawObject();

  await applicationContext.getPersistenceGateway().createTrialSession({
    applicationContext,
    trialSession: trialSessionValidatedRaw,
  });

  return trialSessionValidatedRaw;
};
