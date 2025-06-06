import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('saveCaseNoteInteractor', () => {
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
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    await expect(
      saveCaseNoteInteractor(
        applicationContext,
        {
          caseNote: 'testing',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should save a case note', async () => {
    const result = await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(result).toBeDefined();
    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.caseNote).toEqual('This is my case note');
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      saveCaseNoteInteractor(
        applicationContext,
        {
          caseNote: 'This is my case note',
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
