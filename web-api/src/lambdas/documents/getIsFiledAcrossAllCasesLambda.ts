import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getIsFiledAcrossAllCasesInteractor } from '@web-api/business/useCases/document/getIsFiledAcrossAllCasesInteractor';

export const getIsFiledAcrossAllCasesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await getIsFiledAcrossAllCasesInteractor(
      event.pathParameters,
      authorizedUser,
    );
  });
