import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getBulkTrialSessionCopyNotesInteractor } from '@web-api/business/useCases/trialSessions/getBulkTrialSessionCopyNotesInteractor';

/**
 * get multiple trial session copy notes judge's working copy of a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

export const getBulkTrialSessionCopyNotesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionIds } = JSON.parse(event.body || '{}');

    return await getBulkTrialSessionCopyNotesInteractor(
      applicationContext,
      {
        trialSessionIds,
      },
      authorizedUser,
    );
  });
