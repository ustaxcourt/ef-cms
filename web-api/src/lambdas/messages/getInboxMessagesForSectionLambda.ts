import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getInboxMessagesForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInboxMessagesForSectionInteractor(
        applicationContext,
        {
          section: event.pathParameters.section,
        },
        authorizedUser,
      );
  });
