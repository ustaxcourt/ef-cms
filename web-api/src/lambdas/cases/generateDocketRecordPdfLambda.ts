import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const generateDocketRecordPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generateDocketRecordPdfInteractor(
          applicationContext,
          {
            ...JSON.parse(event.body),
          },
          authorizedUser,
        );
    },
    { logResults: false },
  );
