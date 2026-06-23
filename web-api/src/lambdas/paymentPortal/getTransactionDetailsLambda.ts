import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTransactionDetailsInteractor } from '@web-api/business/useCases/paymentPortal/getTransactionDetailsInteractor';

export const getTransactionDetailsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getTransactionDetailsInteractor(
      applicationContext,
      {
        docketNumber: event.pathParameters.docketNumber,
      },
      authorizedUser,
    );
  });
