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
} from '@ustaxcourt/payment-portal';
import { signRequest } from 'aws-sigv4-sign';

type PaymentPortalRequest =
  | {
      endpoint: 'init';
      data: InitPaymentRequest;
    }
  | {
      endpoint: 'process';
      data: ProcessPaymentRequest;
    }
  | {
      endpoint: 'details';
      data: GetDetailsPathParams;
    };

async function makePaymentPortalRequest(
  applicationContext: ServerApplicationContext,
  request: PaymentPortalRequest,
  method: 'GET' | 'POST',
): Promise<InitPaymentResponse | ProcessPaymentResponse | GetDetailsResponse> {
  let response;
  try {
    if (environment.stage === 'local') {
      const url = `${environment.paymentPortalHost}/${request.endpoint}`;
      if (method === 'GET' && request.endpoint === 'details') {
        response = await applicationContext
          .getHttpClient()
          .get(`${url}/${request.data.transactionReferenceId}`);
      }
      if (method === 'POST') {
        response = await applicationContext
          .getHttpClient()
          .post(url, request.data);
      }
    } else {
      const url = `${environment.paymentPortalHost}/${request.endpoint}`;
      if (method === 'GET' && request.endpoint === 'details') {
        const signedRequest = await signRequest(
          `${url}/${request.data.transactionReferenceId}`,
          {
            service: 'execute-api',
          },
        );
        const headers = Object.fromEntries(signedRequest.headers.entries());
        response = await applicationContext
          .getHttpClient()
          .get(signedRequest.url, {
            headers,
          });
      }
      if (method === 'POST') {
        const signedRequest = await signRequest(
          url,
          {
            method,
            body: JSON.stringify(request.data),
          },
          {
            service: 'execute-api',
          },
        );
        const headers = Object.fromEntries(signedRequest.headers.entries());
        response = await applicationContext
          .getHttpClient()
          .post(signedRequest.url, request.data, { headers });
      }
    }
  } catch (e: unknown) {
    console.log(e);
    getDawsonLogger().error(`Error calling payment portal: ${e}`, e);
    throw new Error(`There was an error calling ${request.endpoint}`);
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
        { endpoint: 'init', data },
        'POST',
      ) as Promise<InitPaymentResponse>;
    },
    processPayment: async (
      applicationContext: ServerApplicationContext,
      data: ProcessPaymentRequest,
    ): Promise<ProcessPaymentResponse> => {
      return makePaymentPortalRequest(
        applicationContext,
        { endpoint: 'process', data },
        'POST',
      ) as Promise<ProcessPaymentResponse>;
    },
    getTransactionDetails: async (
      applicationContext: ServerApplicationContext,
      data: GetDetailsPathParams,
    ): Promise<GetDetailsResponse> => {
      return makePaymentPortalRequest(
        applicationContext,
        { endpoint: 'details', data },
        'GET',
      ) as Promise<GetDetailsResponse>;
    },
  };
};
