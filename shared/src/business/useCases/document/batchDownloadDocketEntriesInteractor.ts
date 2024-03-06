import { NotFoundError } from '../../../../../web-api/src/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TRIAL_SESSION_SCOPE_TYPES } from '../../entities/EntityConstants';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { isEmpty, isEqual } from 'lodash';

/**
 * batchDownloadDocketEntriesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to be closed
 * @returns {Promise} the promise of the updateTrialSession call
 */
export const batchDownloadDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
  { documentIds }: { documentIds: string[] },
) => {
  const user = applicationContext.getCurrentUser();
  console.log('documentIds in BE', documentIds);
  //   if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
  //     throw new UnauthorizedError('Unauthorized');
  //   }
};
