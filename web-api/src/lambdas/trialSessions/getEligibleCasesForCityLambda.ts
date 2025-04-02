import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getEligibleCasesForCityInteractor } from '@shared/business/useCases/getEligibleCasesForCityInteractor';

export const getEligibleCasesForCityLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialCity } = event.pathParameters || {};

    return await getEligibleCasesForCityInteractor(
      applicationContext,
      {
        trialCity,
      },
      authorizedUser,
    );
  });
