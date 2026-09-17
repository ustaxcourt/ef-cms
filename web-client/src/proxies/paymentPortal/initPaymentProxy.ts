import { ClientApplicationContext } from '@web-client/applicationContext';
import { put } from '@web-client/proxies/requests';

export type FilingFeePaymentReturnOrigin = 'dashboard' | 'petition';

export const initPaymentInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    filingFeeReturnOrigin,
  }: {
    docketNumber: string;
    filingFeeReturnOrigin?: FilingFeePaymentReturnOrigin;
  },
): Promise<{ paymentRedirect: string }> => {
  return put({
    applicationContext,
    body: { docketNumber, filingFeeReturnOrigin },
    endpoint: '/filing-fee/init-payment',
  });
};
