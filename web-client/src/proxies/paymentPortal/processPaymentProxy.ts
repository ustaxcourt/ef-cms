import { ClientApplicationContext } from '@web-client/applicationContext';
import { put } from '@web-client/proxies/requests';
import { ProcessPaymentResponse } from '@ustaxcourt/payment-portal/dist';

export const processPaymentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber }: { docketNumber: string },
): Promise<ProcessPaymentResponse> => {
  return put({
    applicationContext,
    body: { docketNumber },
    endpoint: '/filing-fee/process-payment',
  });
};
