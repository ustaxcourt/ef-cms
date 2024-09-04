import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generatePetitionPdfInteractor } from '@shared/business/useCases/generatePetitionPdfInteractor';
import { genericHandler } from '../../genericHandler';

export const generatePetitionPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await generatePetitionPdfInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
