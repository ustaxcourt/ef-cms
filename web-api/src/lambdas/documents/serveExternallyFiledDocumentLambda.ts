import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { serveExternallyFiledDocumentInteractor } from '@web-api/business/useCases/document/serveExternallyFiledDocumentInteractor';

export const serveExternallyFiledDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
