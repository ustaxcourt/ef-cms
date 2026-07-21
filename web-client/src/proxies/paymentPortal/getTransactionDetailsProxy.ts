import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '@web-client/proxies/requests';
import { GetDetailsResponse } from '@ustaxcourt/payment-portal';

export const getTransactionDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber }: { docketNumber: string },
): Promise<GetDetailsResponse> => {
  return get({
    applicationContext,
    endpoint: `/filing-fee/get-transaction-details/${docketNumber}`,
  });
};
