import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generateEntryOfAppearancePdfInteractor } from '@web-api/business/useCases/caseAssociationRequest/generateEntryOfAppearancePdfInteractor';
import { genericHandler } from '../../genericHandler';

export const generateEntryOfAppearancePdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await generateEntryOfAppearancePdfInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
