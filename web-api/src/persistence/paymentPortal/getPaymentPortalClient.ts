import { ServerApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import {
  GetDetailsPathParams,
  GetDetailsResponse,
  InitPaymentRequest,
  InitPaymentResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
} from 'node_modules/@ustaxcourt/payment-portal/dist';
import { signRequest } from 'aws-sigv4-sign';

async function makePaymentPortalRequest(
  applicationContext: ServerApplicationContext,
  endpoint: 'init' | 'process' | 'details',
  method: 'GET' | 'POST',
  data: InitPaymentRequest | ProcessPaymentRequest | GetDetailsPathParams,
): Promise<InitPaymentResponse | ProcessPaymentResponse | GetDetailsResponse> {
  let response;
  try {
    if (environment.stage === 'local') {
      const paymentPortalHost = 'http://localhost:8080';
      const url = `${paymentPortalHost}/${endpoint}`;
      if (method === 'GET') {
        response = await applicationContext
          .getHttpClient()
          .get(
            `${url}/${(data as GetDetailsPathParams).transactionReferenceId}`,
          );
      }
      if (method === 'POST') {
        response = await applicationContext.getHttpClient().post(url, data);
      }
    } else {
      const paymentPortalHost = 'https://dev-payments.ustaxcourt.gov';
      const url = `${paymentPortalHost}/${endpoint}/${(data as GetDetailsPathParams).transactionReferenceId}`;
      const signedRequest = await signRequest(url, { service: 'execute-api' });
      const headers = Object.fromEntries(signedRequest.headers.entries());
      response = await applicationContext.getHttpClient()(signedRequest.url, {
        headers,
      });
    }
  } catch (e: unknown) {
    console.log(e);
    getDawsonLogger().error(`Error calling payment portal: ${e}`, e);
    throw new Error(`There was an error calling ${endpoint}`);
  }

  return response.data;
}

export const getPaymentPortalClient = () => {
  return {
    initPayment: async (
      applicationContext: ServerApplicationContext,
      data: InitPaymentRequest,
    ): Promise<InitPaymentResponse> => {
      return makePaymentPortalRequest(
        applicationContext,
        'init',
        'POST',
        data,
      ) as Promise<InitPaymentResponse>;
    },
    processPayment: async (
      applicationContext: ServerApplicationContext,
      data: ProcessPaymentRequest,
    ): Promise<ProcessPaymentResponse> => {
      return makePaymentPortalRequest(
        applicationContext,
        'process',
        'POST',
        data,
      ) as Promise<ProcessPaymentResponse>;
    },
    getTransactionDetails: async (
      applicationContext: ServerApplicationContext,
      data: GetDetailsPathParams,
    ): Promise<GetDetailsResponse> => {
      return makePaymentPortalRequest(
        applicationContext,
        'details',
        'GET',
        data,
      ) as Promise<GetDetailsResponse>;
    },
  };
};
