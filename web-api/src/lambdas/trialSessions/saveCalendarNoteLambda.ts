import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { saveCalendarNoteInteractor } from '@web-api/business/useCases/trialSessions/saveCalendarNoteInteractor';

/**
 * used for saving a case's calendar note for a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveCalendarNoteLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
      ...JSON.parse(event.body),
    };

    return await saveCalendarNoteInteractor(
      applicationContext,
      {
        ...lambdaArguments,
      },
      authorizedUser,
    );
  });
