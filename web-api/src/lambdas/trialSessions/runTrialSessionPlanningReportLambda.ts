import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { runTrialSessionPlanningReportInteractor } from '@web-api/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';

/**
 * run the trial session planning report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const runTrialSessionPlanningReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await runTrialSessionPlanningReportInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
