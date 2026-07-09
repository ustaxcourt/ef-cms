import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { initPaymentInteractor } from '@web-api/business/useCases/paymentPortal/initPaymentInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { MOCK_CASE } from '@shared/test/mockCase';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { PAYMENT_PORTAL_FEE_TYPES } from '@shared/business/entities/EntityConstants';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { Case } from '@shared/business/entities/cases/Case';

describe('initPaymentInteractor', () => {
  const docketNumber = '101-01';
  const transactionReferenceId = 'mockTransactionReferenceId';
  const mockPetitioner = {
    ...mockPetitionerUser,
    userId: MOCK_CASE.petitioners[0].contactId,
  };

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  const oldEnv = process.env;

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': true,
      });
    applicationContext.getUniqueId.mockReturnValue(transactionReferenceId);
    applicationContext.environment.stage = 'local';
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should throw not found error if feature flag is not set to true', async () => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({
        'enable-payment-portal-integration': false,
      });

    await expect(
      initPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPetitioner,
      ),
    ).rejects.toThrow(NotFoundError);

    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockReturnValue({});

    await expect(
      initPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPetitioner,
      ),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw unauthorized error if user is not associated with the case', async () => {
    await expect(
      initPaymentInteractor(
        applicationContext,
        { docketNumber },
        { ...mockPetitionerUser, userId: '1' },
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw unauthorized error if user cannot initiate filing fee payment', async () => {
    await expect(
      initPaymentInteractor(
        applicationContext,
        { docketNumber },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should call init endpoint on payment portal, set fields in case, and return redirect url', async () => {
    const result = await initPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPetitioner,
    );

    expect(applicationContext.getUniqueId).toHaveBeenCalled();

    expect(
      applicationContext.getPaymentPortalClient().initPayment,
    ).toHaveBeenCalledWith(applicationContext, {
      transactionReferenceId,
      fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
      urlSuccess: `http://localhost:1234/payment-success/${docketNumber}`,
      urlCancel: `http://localhost:1234/payment-cancel/${docketNumber}`,
      metadata: {
        docketNumber,
      },
    });

    expect(updateCaseAndAssociations).toHaveBeenCalledWith({
      authorizedUser: mockPetitioner,
      caseToUpdate: {
        ...new Case(MOCK_CASE, { authorizedUser: mockPetitioner }),
        petitionPaymentTransactionReferenceId: transactionReferenceId,
        petitionPaymentToken: 'mockPaymentToken',
      },
    });

    expect(result).toEqual({
      paymentRedirect: 'mockPaymentRedirect',
    });
  });

  it('should not generate a new transaction reference id if one already exists', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      petitionPaymentTransactionReferenceId: transactionReferenceId,
    });

    await initPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPetitioner,
    );

    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
  });

  it('should use deployed domain for urlSuccess and urlCancel if not running locally', async () => {
    applicationContext.environment.stage = 'notlocal';
    process.env.EFCMS_DOMAIN = 'env.mock';

    await initPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPetitioner,
    );

    expect(
      applicationContext.getPaymentPortalClient().initPayment,
    ).toHaveBeenCalledWith(applicationContext, {
      transactionReferenceId,
      fee: PAYMENT_PORTAL_FEE_TYPES.PETITION_FILING_FEE,
      urlSuccess: `https://app.env.mock/payment-success/${docketNumber}`,
      urlCancel: `https://app.env.mock/payment-cancel/${docketNumber}`,
      metadata: {
        docketNumber,
      },
    });
  });

  it('should acquire a lock on the case', async () => {
    await initPaymentInteractor(
      applicationContext,
      { docketNumber },
      mockPetitioner,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${docketNumber}`],
      }),
    );
  });
});
