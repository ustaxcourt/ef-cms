import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('@web-api/persistence/postgres/cases/deleteCaseNote');
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseNote as deleteCaseNoteMock } from '@web-api/persistence/postgres/cases/deleteCaseNote';
import { deleteCaseNoteInteractor } from './deleteCaseNoteInteractor';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';

describe('deleteCaseNoteInteractor', () => {
  let mockUser: AuthUser;

  const deleteCaseNotePersistence = jest.mocked(deleteCaseNoteMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    mockUser = mockJudgeUser;
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    mockUser = {} as AuthUser;
    let error;
    try {
      await deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('should delete a procedural note', async () => {
    const result = await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(result).toBeDefined();
    expect(deleteCaseNotePersistence).toHaveBeenCalledWith({
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.docketNumber).toBeDefined();
  });

  it('should return the docket number after successful deletion', async () => {
    const result = await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(result).toEqual({ docketNumber: MOCK_CASE.docketNumber });
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(deleteCaseNotePersistence).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
