import { ClientApplicationContext } from '@web-client/applicationContext';
import { get } from '@web-client/proxies/requests';

export const getTransactionDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<{ paymentRedirect: string }> => {
  return get({
    applicationContext,
    endpoint: `/filing-fee/get-transaction-details/${docketNumber}`,
  });
};
