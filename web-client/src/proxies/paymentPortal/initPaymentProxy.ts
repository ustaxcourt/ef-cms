import { ClientApplicationContext } from '@web-client/applicationContext';
import { put } from '@web-client/proxies/requests';
import { type PaymentFilingFeeOrigin } from '@shared/business/entities/EntityConstants';

export type FilingFeePaymentReturnOrigin = PaymentFilingFeeOrigin;

export const initPaymentInteractor = (
  applicationContext: ClientApplicationContext,
  {
    docketNumber,
    filingFeeReturnOrigin,
    filingFeeReturnPage,
  }: {
    docketNumber: string;
    filingFeeReturnOrigin?: FilingFeePaymentReturnOrigin;
    filingFeeReturnPage?: number;
  },
): Promise<{ paymentRedirect: string }> => {
  return put({
    applicationContext,
    body: { docketNumber, filingFeeReturnOrigin, filingFeeReturnPage },
    endpoint: '/filing-fee/init-payment',
  });
};
