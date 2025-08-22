import '@web-api/persistence/postgres/userCaseNotes/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getUserCaseNoteInteractor } from './getUserCaseNoteInteractor';
import { getUserCaseNotes as getUserCaseNotesMock } from '@web-api/persistence/postgres/userCaseNotes/getUserCaseNotes';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { UserCaseNote } from '@shared/business/entities/notes/UserCaseNote';

describe('Get case note', () => {
  const MOCK_NOTE = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'something',
    userId: mockJudgeUser.userId,
  };

  const mockUnauthorizedUser = {
    role: 'unauthorizedRole',
    userId: 'unauthorizedUser',
  } as unknown as UnknownAuthUser;

  const getUserCaseNotes = getUserCaseNotesMock as jest.Mock;

  it('throws error if user is unauthorized', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => new User(mockUnauthorizedUser));
    getUserCaseNotes.mockResolvedValue([{}]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    await expect(
      getUserCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_NOTE.docketNumber,
        },
        mockUnauthorizedUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => new User(mockJudgeUser));
    getUserCaseNotes.mockResolvedValue([
      new UserCaseNote(omit(MOCK_NOTE, 'userId')),
    ]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudgeUser);

    await expect(
      getUserCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_NOTE.docketNumber,
        },
        omit(mockJudgeUser, 'section'),
      ),
    ).rejects.toThrow('The UserCaseNote entity was invalid');
  });

  it('correctly returns data from persistence if a judgeUser exists', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => new User(mockJudgeUser));
    getUserCaseNotes.mockResolvedValue([new UserCaseNote(MOCK_NOTE)]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudgeUser);

    const result = await getUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_NOTE.docketNumber,
      },
      omit(mockJudgeUser, 'section'),
    );

    expect(result).toMatchObject(MOCK_NOTE);
  });

  it('correctly returns data from persistence for the current user if a judgeUser does not exist', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => new User(mockJudgeUser));
    getUserCaseNotes.mockResolvedValue([new UserCaseNote(MOCK_NOTE)]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    const result = await getUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_NOTE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(result).toMatchObject({
      ...MOCK_NOTE,
      userId: mockJudgeUser.userId,
    });
  });

  it('does not return anything if nothing is returned from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => new User(mockJudgeUser));
    getUserCaseNotes.mockReturnValue(null);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudgeUser);

    const result = await getUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_NOTE.docketNumber,
      },
      mockJudgeUser,
    );

    expect(result).toEqual(undefined);
  });
});
