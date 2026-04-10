import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { blockCaseFromTrialInteractor } from './blockCaseFromTrialInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';

describe('blockCaseFromTrialInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const upsertCases = jest.mocked(upsertCasesMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(upsertCases).toHaveBeenCalled();
    const casePassedToUpdate = upsertCases.mock.calls[0][0][0];
    expect(casePassedToUpdate.blocked).toBe(true);
    expect(casePassedToUpdate.blockedReason).toBe('just because');
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      blockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          reason: 'just because',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });

  it('should throw an unauthorized error when the user has no access to block cases', async () => {
    await expect(
      blockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });
});
