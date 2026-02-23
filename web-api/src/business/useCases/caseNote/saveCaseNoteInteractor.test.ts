import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('@web-api/persistence/postgres/cases/updateCaseNote');
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockJudgeUser, mockPetitionerUser } from '@shared/test/mockAuthUsers';
import { saveCaseNoteInteractor } from './saveCaseNoteInteractor';
import { updateCaseNote as updateCaseNoteMock } from '@web-api/persistence/postgres/cases/updateCaseNote';

describe('saveCaseNoteInteractor', () => {
  const updateCaseNote = jest.mocked(updateCaseNoteMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

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
    expect(updateCaseNote).toHaveBeenCalledWith({
      caseNote: 'This is my case note',
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.caseNote).toEqual('This is my case note');
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

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

    expect(updateCaseNote).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await saveCaseNoteInteractor(
      applicationContext,
      {
        caseNote: 'This is my case note',
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
