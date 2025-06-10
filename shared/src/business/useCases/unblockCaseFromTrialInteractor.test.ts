import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { unblockCaseFromTrialInteractor } from './unblockCaseFromTrialInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('unblockCaseFromTrialInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });
  });
  it('should set the blocked flag to false and remove the blockedReason', async () => {
    const result = await unblockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      blocked: false,
      blockedReason: undefined,
    });
  });

  it('should throw an unauthorized error if the user has no access to unblock the case', async () => {
    await expect(
      unblockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      unblockCaseFromTrialInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await unblockCaseFromTrialInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
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
});
