import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateNoticeOfWithdrawalPdfInteractor } from '@web-api/business/useCases/practitioner/generateNoticeOfWithdrawalPdfInteractor';

import { genericHandler } from '@web-api/genericHandler';

export const generateNoticeOfWithdrawalPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await generateNoticeOfWithdrawalPdfInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
