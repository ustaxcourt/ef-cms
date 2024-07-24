import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addPaperFilingInteractor } from '@web-api/business/useCases/docketEntry/addPaperFilingInteractor';
import { genericHandler } from '../../genericHandler';

export const addPaperFilingLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await addPaperFilingInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
