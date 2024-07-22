import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCaseToTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/addCaseToTrialSessionInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda for adding a case to a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addCaseToTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } = event.pathParameters || event.path;
    const { calendarNotes } = JSON.parse(event.body);

    return await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes,
        docketNumber,
        trialSessionId,
      },
      authorizedUser,
    );
  });
