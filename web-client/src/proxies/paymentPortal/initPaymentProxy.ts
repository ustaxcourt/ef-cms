import { ClientApplicationContext } from '@web-client/applicationContext';
import { put } from '@web-client/proxies/requests';

export const initPaymentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<{ paymentRedirect: string }> => {
  return put({
    applicationContext,
    body: { docketNumber },
    endpoint: '/filing-fee/init-payment',
  });
};
