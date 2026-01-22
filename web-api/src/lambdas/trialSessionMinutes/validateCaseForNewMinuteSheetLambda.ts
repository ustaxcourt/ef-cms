import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { validateCaseForNewMinuteSheetInteractor } from '@web-api/business/useCases/trialSessionMinutes/validateCaseForNewMinuteSheetInteractor';

/**
 * validates a case for new minute sheet creation
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const validateCaseForNewMinuteSheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { trialSessionId } = event.pathParameters || {};
    const { docketNumber } = event.queryStringParameters || {};

    return await validateCaseForNewMinuteSheetInteractor(
      {
        docketNumber,
        trialSessionId,
      },
      authorizedUser,
    );
  });
