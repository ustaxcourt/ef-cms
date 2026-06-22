import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDocketEntryProcessingStatusInteractor } from '@web-api/business/useCases/docketEntry/getDocketEntryProcessingStatusInteractor';

export const getDocketEntryProcessingStatusLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getDocketEntryProcessingStatusInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
    },
    { logResults: false },
  );
