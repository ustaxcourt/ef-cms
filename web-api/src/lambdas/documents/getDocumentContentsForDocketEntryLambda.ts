import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getDocumentContentsForDocketEntryInteractor } from '@web-api/business/useCases/document/getDocumentContentsForDocketEntryInteractor';

export const getDocumentContentsForDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getDocumentContentsForDocketEntryInteractor(
      applicationContext,
      event.pathParameters,
      authorizedUser,
    );
  });
