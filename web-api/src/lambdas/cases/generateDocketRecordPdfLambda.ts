import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateDocketRecordPdfInteractor } from '@web-api/business/useCases/generateDocketRecordPdfInteractor';
import { genericHandler } from '../../genericHandler';

export const generateDocketRecordPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
