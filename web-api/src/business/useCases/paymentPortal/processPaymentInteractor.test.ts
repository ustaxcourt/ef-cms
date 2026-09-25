import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { mockEntireFile } from '@shared/test/mockFactory';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
jest.mock('@shared/business/utilities/DateHandler', () =>
  mockEntireFile({
    keepImplementation: true,
    module: '@shared/business/utilities/DateHandler',
  }),
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockIrsPractitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS } from '@shared/test/mockCase';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { processPaymentInteractor } from '@web-api/business/useCases/paymentPortal/processPaymentInteractor';
import {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '@shared/business/entities/EntityConstants';
import { createISODateAtStartOfDayEST as createISODateAtStartOfDayESTMock } from '@shared/business/utilities/DateHandler';

describe('processPaymentInteractor', () => {
  const docketNumber = '101-01';
  const transactionReferenceId = '77d9b6e2-508f-4e36-8fb1-0b2e20557898';
  const mockPaymentToken = 'mockPaymentToken';
  const mockPractitioner = {
    ...mockPrivatePractitionerUser,
    userId:
      MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0].userId,
  };
  const mockProcessPaymentResponse = {
    paymentStatus: 'success',
    transactions: [
      {
        payGovTrackingId: 'payGovTrackingId',
        transactionStatus: 'failed',
        paymentMethod: 'Credit/Debit Card',
        createdTimestamp: '2026-06-01T00:00:00.000Z',
        updatedTimestamp: '2026-06-01T00:00:00.000Z',
      },
      {
        payGovTrackingId: 'payGovTrackingId',
        transactionStatus: 'processed',
        paymentMethod: 'PayPal',
        createdTimestamp: '2026-07-01T00:00:00.000Z',
        updatedTimestamp: '2026-07-01T00:00:00.000Z',
      },
    ],
  };
  const mockToday = '2026-09-01T00:00:00-04:00';

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const createISODateAtStartOfDayEST = jest.mocked(
    createISODateAtStartOfDayESTMock,
  );

  beforeAll(() => {
    createISODateAtStartOfDayEST.mockReturnValue(mockToday);
  });

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      petitionPaymentToken: mockPaymentToken,
      docketNumber,
    });
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': true,
      });
    applicationContext.getUniqueId.mockReturnValue(transactionReferenceId);
    applicationContext.environment.stage = 'local';
    applicationContext
      .getPaymentPortalClient()
      .processPayment.mockResolvedValue(mockProcessPaymentResponse);
  });

  it('should throw not found error if feature flag is not set to true', async () => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': false,
      });

    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPractitioner,
      ),
    ).rejects.toThrow(NotFoundError);

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({});

    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPractitioner,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw unauthorized error if user cannot initiate filing fee payment', async () => {
    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw unauthorized error if user is not associated with the case', async () => {
    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        { ...mockPractitioner, userId: '1' },
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw invalid request error if case entity does not have a payment token', async () => {
    getCaseByDocketNumber.mockResolvedValue(
      MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
    );

    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPractitioner,
      ),
    ).rejects.toThrow(InvalidRequest);
  });

  it('should throw an error if filing fee is not unpaid', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      petitionPaymentToken: mockPaymentToken,
      docketNumber,
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    });

    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPractitioner,
      ),
    ).rejects.toThrow(
      `Cannot process filing fee payment for ${docketNumber} with status Paid`,
    );

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      petitionPaymentToken: mockPaymentToken,
      docketNumber,
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
    });

    await expect(
      processPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPractitioner,
      ),
    ).rejects.toThrow(
      `Cannot process filing fee payment for ${docketNumber} with status Waived`,
    );
  });

  it('should process endpoint on payment portal, delete token from db, update payment fields, and return process response', async () => {
    const result = await processPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPractitioner,
    );

    expect(
      applicationContext.getPaymentPortalClient().processPayment,
    ).toHaveBeenCalledWith(applicationContext, {
      token: mockPaymentToken,
    });

    const { authorizedUser, caseToUpdate } =
      updateCaseAndAssociations.mock.calls[0][0];

    expect(authorizedUser).toEqual(mockPractitioner);

    expect(caseToUpdate).toMatchObject({
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
      petitionPaymentDate: mockToday,
      petitionPaymentMethod: 'Pay.gov',
    });

    expect(caseToUpdate).not.toHaveProperty('petitionPaymentToken');

    expect(caseToUpdate.docketEntries[0]).toMatchObject({
      documentTitle: 'Filing Fee Paid',
      documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
      eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
      filingDate: mockToday,
      isFileAttached: false,
      isOnDocketRecord: true,
      processingStatus: 'complete',
      filedByRole: 'privatePractitioner',
      userId: mockPractitioner.userId,
      docketNumber,
      index: 1,
    });

    expect(result).toEqual(mockProcessPaymentResponse);
  });

  it('should not update case payment information is transaction is not successful', async () => {
    const mockProcessPaymentResponse = {
      paymentStatus: 'failed',
      transactions: [
        {
          payGovTrackingId: 'payGovTrackingId',
          transactionStatus: 'failed',
          paymentMethod: 'Credit/Debit Card',
          createdTimestamp: '2026-06-01T00:00:00.000Z',
          updatedTimestamp: '2026-06-01T00:00:00.000Z',
        },
      ],
    };

    applicationContext
      .getPaymentPortalClient()
      .processPayment.mockResolvedValue(mockProcessPaymentResponse);

    const result = await processPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPractitioner,
    );

    const { authorizedUser, caseToUpdate } =
      updateCaseAndAssociations.mock.calls[0][0];

    expect(authorizedUser).toEqual(mockPractitioner);

    expect(caseToUpdate).toMatchObject({
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      petitionPaymentDate: undefined,
      petitionPaymentMethod: undefined,
    });
    expect(caseToUpdate).not.toHaveProperty('petitionPaymentToken');
    expect(caseToUpdate.docketEntries.length).toEqual(0);

    expect(result).toEqual(mockProcessPaymentResponse);
  });

  it('should update payment status to pending if pending response is reeturned from payment portal', async () => {
    const mockProcessPaymentResponse = {
      paymentStatus: 'pending',
      transactions: [
        {
          payGovTrackingId: 'payGovTrackingId',
          transactionStatus: 'pending',
          paymentMethod: 'ACH',
          createdTimestamp: '2026-06-01T00:00:00.000Z',
          updatedTimestamp: '2026-06-01T00:00:00.000Z',
        },
      ],
    };

    applicationContext
      .getPaymentPortalClient()
      .processPayment.mockResolvedValue(mockProcessPaymentResponse);

    const result = await processPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPractitioner,
    );

    const { authorizedUser, caseToUpdate } =
      updateCaseAndAssociations.mock.calls[0][0];

    expect(authorizedUser).toEqual(mockPractitioner);

    expect(caseToUpdate).toMatchObject({
      petitionPaymentStatus: PAYMENT_STATUS.PENDING,
      petitionPaymentDate: undefined,
      petitionPaymentMethod: undefined,
    });
    expect(caseToUpdate).not.toHaveProperty('petitionPaymentToken');
    expect(caseToUpdate.docketEntries.length).toEqual(0);

    expect(result).toEqual(mockProcessPaymentResponse);
  });

  it('should acquire a lock on the case', async () => {
    await processPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPractitioner,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${docketNumber}`],
      }),
    );
  });
});
