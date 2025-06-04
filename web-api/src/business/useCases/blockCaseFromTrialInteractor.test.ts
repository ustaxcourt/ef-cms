import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { MOCK_CASE } from '@shared/test/mockCase';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { blockCaseFromTrialInteractor } from './blockCaseFromTrialInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('blockCaseFromTrialInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    updateCaseAndAssociations.mockImplementation(
      ({ caseToUpdate }) => caseToUpdate,
    );
  });

  it('should update the case with the blocked flag set as true and attach a reason', async () => {
    const result = await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      blocked: true,
      blockedReason: 'just because',
    });
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

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

  it('should acquire and remove the lock on the case', async () => {
    await blockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
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
