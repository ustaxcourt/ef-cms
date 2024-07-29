import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPaperServicePdfUrlInteractor } from '@shared/business/useCases/getPaperServicePdfUrlInteractor';

export const getPaperServicePdfUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getPaperServicePdfUrlInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
    },
    { logResults: false },
  );
