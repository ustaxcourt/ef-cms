import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getOutboxMessagesForSectionInteractor } from '@web-api/business/useCases/messages/getOutboxMessagesForSectionInteractor';

export const getOutboxMessagesForSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getOutboxMessagesForSectionInteractor(
      applicationContext,
      {
        section: event.pathParameters.section,
      },
      authorizedUser,
    );
  });
