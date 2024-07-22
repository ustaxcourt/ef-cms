import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getOutboxMessagesForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getOutboxMessagesForSectionInteractor(
        applicationContext,
        {
          section: event.pathParameters.section,
        },
        authorizedUser,
      );
  });
