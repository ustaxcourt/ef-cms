import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getInboxMessagesForSectionInteractor } from '@web-api/business/useCases/messages/getInboxMessagesForSectionInteractor';

export const getInboxMessagesForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getInboxMessagesForSectionInteractor(
      applicationContext,
      {
        section: event.pathParameters.section,
      },
      authorizedUser,
    );
  });
