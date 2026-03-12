jest.mock('@web-api/persistence/postgres/cases/updateCaseNote');
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MOCK_CASE } from '@shared/test/mockCase';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseNoteInteractor } from './deleteCaseNoteInteractor';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { updateCaseNote as updateCaseNoteMock } from '@web-api/persistence/postgres/cases/updateCaseNote';

describe('deleteCaseNoteInteractor', () => {
  let mockUser: AuthUser;

  const updateCaseNote = jest.mocked(updateCaseNoteMock);

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

  it('should delete a case note', async () => {
    await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(updateCaseNote).toHaveBeenCalledWith({
      caseNote: null,
      docketNumber: MOCK_CASE.docketNumber,
    });
  });
});
