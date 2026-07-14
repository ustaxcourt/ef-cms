import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
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
import { Case } from '@shared/business/entities/cases/Case';
import { processPaymentInteractor } from '@web-api/business/useCases/paymentPortal/processPaymentInteractor';

describe('processPaymentInteractor', () => {
  const docketNumber = '101-01';
  const transactionReferenceId = 'mockTransactionReferenceId';
  const mockPaymentToken = 'mockPaymentToken';
  const mockPractitioner = {
    ...mockPrivatePractitionerUser,
    userId:
      MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0].userId,
  };

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
      petitionPaymentToken: mockPaymentToken,
    });
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': true,
      });
    applicationContext.getUniqueId.mockReturnValue(transactionReferenceId);
    applicationContext.environment.stage = 'local';
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

  it('should process endpoint on payment portal, delete token from db, and return process response', async () => {
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

    expect(updateCaseAndAssociations).toHaveBeenCalledWith({
      authorizedUser: mockPractitioner,
      caseToUpdate: {
        ...new Case(MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS, {
          authorizedUser: mockPractitioner,
        }),
      },
    });

    expect(result).toEqual({
      paymentStatus: 'success',
      transactions: [
        {
          payGovTrackingId: 'payGovTrackingId',
          transactionStatus: 'processed',
          paymentMethod: 'PayPal',
          createdTimestamp: '2026-07-01T00:00:00.000Z',
          updatedTimestamp: '2026-07-01T00:00:00.000Z',
        },
      ],
    });
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
