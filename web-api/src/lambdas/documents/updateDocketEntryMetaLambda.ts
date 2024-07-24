import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateDocketEntryMetaInteractor } from '@web-api/business/useCases/docketEntry/updateDocketEntryMetaInteractor';

export const updateDocketEntryMetaLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateDocketEntryMetaInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
