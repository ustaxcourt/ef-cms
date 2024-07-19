import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getDocumentContentsForDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getDocumentContentsForDocketEntryInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
  });
