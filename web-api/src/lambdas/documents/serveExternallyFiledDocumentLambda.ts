import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const serveExternallyFiledDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
  });
