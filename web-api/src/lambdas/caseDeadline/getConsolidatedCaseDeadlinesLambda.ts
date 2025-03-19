import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '@web-api/genericHandler';
import { getConsolidatedCaseDeadlinesInteractor } from '@shared/business/useCases/getConsolidatedCaseDeadlinesInteractor';

export const getConsolidatedCaseDeadlinesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getConsolidatedCaseDeadlinesInteractor(
      applicationContext,
      {
        consolidatedCaseDeadlineId:
          event.pathParameters.consolidatedCaseDeadlineId,
      },
      authorizedUser,
    );
  });
