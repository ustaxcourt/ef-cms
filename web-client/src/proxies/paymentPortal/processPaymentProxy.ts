import { ClientApplicationContext } from '@web-client/applicationContext';
import { put } from '@web-client/proxies/requests';
import { ProcessPaymentResponse } from 'node_modules/@ustaxcourt/payment-portal/dist';

export const processPaymentInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
): Promise<{ processPaymentRepsone: ProcessPaymentResponse }> => {
  return put({
    applicationContext,
    body: { docketNumber },
    endpoint: '/filing-fee/process-payment',
  });
};
