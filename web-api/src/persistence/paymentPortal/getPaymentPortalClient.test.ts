import { PAYMENT_PORTAL_FEE_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { environment } from '@web-api/environment';
import { getPaymentPortalClient } from '@web-api/persistence/paymentPortal/getPaymentPortalClient';
const mockLogger = {
  error: jest.fn(),
};
jest.mock('@web-api/utilities/logger/getDawsonLogger', () => {
  return {
    getDawsonLogger: () => mockLogger,
  };
});
jest.mock('aws-sigv4-sign', () => ({
  signRequest: jest.fn().mockImplementation(url => {
    return {
      url,
      headers: new Map([['authorization', 'signed-authorization']]),
    };
  }),
}));
import { signRequest } from 'aws-sigv4-sign';
const mockSignRequest = jest.mocked(signRequest);

describe('getPaymentPortalClient', () => {
  const transactionReferenceId = '44d6feee-e91a-4ace-93a5-4ff6795df725';

  const paymentPortalInitResponse = {
    data: {
      token: 'payment-token',
      paymentRedirect: 'localhost/pay?token=payment-token',
    },
  };

  const paymentPortalProcessAndDetailsResponse = {
    data: {
      paymentStatus: 'success',
      transactions: [
        {
          payGovTrackingId: 'trackingid',
          transactionStatus: 'processed',
          paymentMethod: 'Credit/Debit Card',
          createdTimestamp: '2026-07-01T00:00:00.000Z',
          updatedTimestamp: '2026-07-01T00:00:00.000Z',
        },
      ],
    },
  };

  beforeAll(() => {
    applicationContext.getHttpClient = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue(paymentPortalProcessAndDetailsResponse),
      post: jest.fn().mockImplementation((url: string) => {
        if (url.includes('init')) {
          return paymentPortalInitResponse;
        } else {
          return paymentPortalProcessAndDetailsResponse;
        }
      }),
    });
  });

  it('should make a local init payment request', async () => {
    environment.stage = 'local';
    environment.paymentPortalHost = 'localhost';

    const initPaymentData = {
      transactionReferenceId,
      fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
      urlSuccess: 'localhost/payment-success',
      urlCancel: 'localhost/payment-cancel',
      metadata: {
        docketNumber: '101-01',
      },
    };

    const results = await getPaymentPortalClient().initPayment(
      applicationContext,
      initPaymentData,
    );

    expect(applicationContext.getHttpClient().post).toHaveBeenCalledWith(
      'localhost/init',
      initPaymentData,
    );
    expect(results).toEqual(paymentPortalInitResponse.data);
  });

  it('should make a signed init payment request', async () => {
    environment.stage = 'notlocal';
    environment.paymentPortalHost = 'dev-payment-portal';

    const initPaymentData = {
      transactionReferenceId,
      fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
      urlSuccess: 'localhost/payment-success',
      urlCancel: 'localhost/payment-cancel',
      metadata: {
        docketNumber: '101-01',
      },
    };

    const results = await getPaymentPortalClient().initPayment(
      applicationContext,
      initPaymentData,
    );

    expect(mockSignRequest).toHaveBeenCalledWith(
      'dev-payment-portal/init',
      {
        method: 'POST',
        body: JSON.stringify(initPaymentData),
      },
      {
        service: 'execute-api',
      },
    );

    expect(applicationContext.getHttpClient().post).toHaveBeenCalledWith(
      'dev-payment-portal/init',
      initPaymentData,
      {
        headers: {
          authorization: 'signed-authorization',
        },
      },
    );
    expect(results).toEqual(paymentPortalInitResponse.data);
  });

  it('should make a local process payment request', async () => {
    environment.stage = 'local';
    environment.paymentPortalHost = 'localhost';

    const processPaymentData = {
      token: 'payment-token',
    };

    const results = await getPaymentPortalClient().processPayment(
      applicationContext,
      processPaymentData,
    );

    expect(applicationContext.getHttpClient().post).toHaveBeenCalledWith(
      'localhost/process',
      processPaymentData,
    );
    expect(results).toEqual(paymentPortalProcessAndDetailsResponse.data);
  });

  it('should make a signed process payment request', async () => {
    environment.stage = 'notlocal';
    environment.paymentPortalHost = 'dev-payment-portal';

    const processPaymentData = {
      token: 'payment-token',
    };

    const results = await getPaymentPortalClient().processPayment(
      applicationContext,
      processPaymentData,
    );

    expect(mockSignRequest).toHaveBeenCalledWith(
      'dev-payment-portal/process',
      {
        method: 'POST',
        body: JSON.stringify(processPaymentData),
      },
      {
        service: 'execute-api',
      },
    );

    expect(applicationContext.getHttpClient().post).toHaveBeenCalledWith(
      'dev-payment-portal/process',
      processPaymentData,
      {
        headers: {
          authorization: 'signed-authorization',
        },
      },
    );
    expect(results).toEqual(paymentPortalProcessAndDetailsResponse.data);
  });

  it('should make a local get transaction details request', async () => {
    environment.stage = 'local';
    environment.paymentPortalHost = 'localhost';

    const getTransactionDetailsData = {
      transactionReferenceId,
    };

    const results = await getPaymentPortalClient().getTransactionDetails(
      applicationContext,
      getTransactionDetailsData,
    );

    expect(applicationContext.getHttpClient().get).toHaveBeenCalledWith(
      `localhost/details/${transactionReferenceId}`,
    );
    expect(results).toEqual(paymentPortalProcessAndDetailsResponse.data);
  });

  it('should make a signed get transaction details request', async () => {
    environment.stage = 'notlocal';
    environment.paymentPortalHost = 'dev-payment-portal';

    const getTransactionDetailsData = {
      transactionReferenceId,
    };

    const results = await getPaymentPortalClient().getTransactionDetails(
      applicationContext,
      getTransactionDetailsData,
    );

    expect(mockSignRequest).toHaveBeenCalledWith(
      `dev-payment-portal/details/${transactionReferenceId}`,
      {
        service: 'execute-api',
      },
    );

    expect(applicationContext.getHttpClient().get).toHaveBeenCalledWith(
      `dev-payment-portal/details/${transactionReferenceId}`,
      {
        headers: {
          authorization: 'signed-authorization',
        },
      },
    );
    expect(results).toEqual(paymentPortalProcessAndDetailsResponse.data);
  });

  it('should log a failed request', async () => {
    environment.stage = 'local';
    environment.paymentPortalHost = 'localhost';

    const initPaymentData = {
      transactionReferenceId,
      fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
      urlSuccess: 'localhost/payment-success',
      urlCancel: 'localhost/payment-cancel',
      metadata: {
        docketNumber: '101-01',
      },
    };

    applicationContext
      .getHttpClient()
      .post.mockRejectedValueOnce(new Error('Invalid Request'));

    await expect(
      getPaymentPortalClient().initPayment(applicationContext, initPaymentData),
    ).rejects.toThrow('There was an error calling init');

    expect(mockLogger.error).toHaveBeenCalled();
  });
});
