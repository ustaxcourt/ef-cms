import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removeCaseFromTrialInteractor } from '@web-api/business/useCases/trialSessions/removeCaseFromTrialInteractor';

/**
 * used for setting a case on a trial session to removedFromTrial
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removeCaseFromTrialLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } = event.pathParameters || event.path;
    const { associatedJudge, associatedJudgeId, caseStatus, disposition } =
      JSON.parse(event.body);

    return await removeCaseFromTrialInteractor(
      applicationContext,
      {
        associatedJudge,
        associatedJudgeId,
        caseStatus,
        disposition,
        docketNumber,
        trialSessionId,
      },
      authorizedUser,
    );
  });
