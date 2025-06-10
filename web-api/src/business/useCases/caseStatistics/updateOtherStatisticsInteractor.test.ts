jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateOtherStatisticsInteractor } from './updateOtherStatisticsInteractor';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('updateOtherStatisticsInteractor', () => {
  let authorizedUser: UnknownAuthUser;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  beforeAll(() => {
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  beforeEach(() => {
    authorizedUser = mockDocketClerkUser;

    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw an error when the user is unauthorized to update case statistics', async () => {
    authorizedUser = {} as UnknownAuthUser;

    await expect(
      updateOtherStatisticsInteractor(
        applicationContext,
        { docketNumber: MOCK_CASE.docketNumber } as any,
        authorizedUser,
      ),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const result = await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
    );
    expect(result).toMatchObject({
      damages: 1234,
      litigationCosts: 5678,
    });
  });
  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      updateOtherStatisticsInteractor(
        applicationContext,
        {
          damages: 1234,
          docketNumber: MOCK_CASE.docketNumber,
          litigationCosts: 5678,
        },
        authorizedUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
