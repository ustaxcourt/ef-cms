import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { MOCK_CASE } from '@shared/test/mockCase';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getTransactionDetailsInteractor } from '@web-api/business/useCases/paymentPortal/getTransactionDetailsInteractor';

describe('getTransactionDetailsInteractor', () => {
  const docketNumber = '101-01';
  const transactionReferenceId = 'mockTransactionReferenceId';

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      petitionPaymentTransactionReferenceId: transactionReferenceId,
    });
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': true,
      });
  });

  it('should throw not found error if feature flag is not set to true', async () => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': false,
      });

    await expect(
      getTransactionDetailsInteractor(
        applicationContext,
        { docketNumber },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(NotFoundError);

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({});

    await expect(
      getTransactionDetailsInteractor(
        applicationContext,
        { docketNumber },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw unauthorized error if user cannot initiate filing fee payment', async () => {
    await expect(
      getTransactionDetailsInteractor(
        applicationContext,
        { docketNumber },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw not found error if case does not have an active payment portal transaction', async () => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    await expect(
      getTransactionDetailsInteractor(
        applicationContext,
        { docketNumber },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call get details payment portal endpoint and return result', async () => {
    const results = await getTransactionDetailsInteractor(
      applicationContext,
      { docketNumber },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getPaymentPortalClient().getTransactionDetails,
    ).toHaveBeenCalledWith(applicationContext, {
      transactionReferenceId,
    });

    expect(results).toEqual({
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
});
