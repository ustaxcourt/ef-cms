import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { isEmpty, isEqual } from 'lodash';

/**
 * closeTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to be closed
 * @returns {Promise} the promise of the updateTrialSession call
 */
export const closeTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
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

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  if (
    trialSession.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
  ) {
    throw new Error(
      'Only standalone remote trial sessions can be closed manually',
    );
  }

  if (
    trialSession.startDate >
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

  if (!isEmpty(allCases) && !isEqual(allCases, inactiveCases)) {
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
