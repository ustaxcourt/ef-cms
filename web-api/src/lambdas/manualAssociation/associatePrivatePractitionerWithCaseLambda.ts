import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { associatePrivatePractitionerWithCaseInteractor } from '@web-api/business/useCases/manualAssociation/associatePrivatePractitionerWithCaseInteractor';
import { genericHandler } from '../../genericHandler';

export const associatePrivatePractitionerWithCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await associatePrivatePractitionerWithCaseInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
