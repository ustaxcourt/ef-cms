import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateOtherStatisticsInteractor } from './updateOtherStatisticsInteractor';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';

describe('updateOtherStatisticsInteractor', () => {
  let authorizedUser: UnknownAuthUser;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertCases = jest.mocked(upsertCasesMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

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

  it('should call updateCase with the updated case statistics', async () => {
    await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
    );

    expect(upsertCases).toHaveBeenCalled();
    expect(upsertCases.mock.calls[0][0][0]).toMatchObject({
      damages: 1234,
      litigationCosts: 5678,
    });
  });
  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

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

  it('should acquire a lock on the case', async () => {
    await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
