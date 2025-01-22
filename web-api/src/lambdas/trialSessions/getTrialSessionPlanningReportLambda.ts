import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionPlanningReportDataInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionPlanningReportDataInteractor';

export const getTrialSessionPlanningReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getTrialSessionPlanningReportDataInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
