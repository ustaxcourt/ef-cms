import '@web-api/persistence/postgres/userCaseNotes/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateUserCaseNoteInteractor } from './updateUserCaseNoteInteractor';
import { upsertUserCaseNotes as upsertUserCaseNotesMock } from '@web-api/persistence/postgres/userCaseNotes/upsertUserCaseNotes';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

describe('updateUserCaseNoteInteractor', () => {
  const mockCaseNote = {
    docketNumber: '123-45',
    notes: 'hello world',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const upsertUserCaseNotes = upsertUserCaseNotesMock as jest.Mock;
  const getUserById = getUserByIdMock as jest.Mock;

  it('throws an error if the user is not valid or authorized', async () => {
    await expect(
      updateUserCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: mockCaseNote.docketNumber,
          notes: mockCaseNote.notes,
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('updates a case note', async () => {
    const mockUser = {
      ...mockJudgeUser,
      section: 'colvinChambers',
    } as UnknownAuthUser;
    getUserById.mockImplementation(() => mockUser);
    upsertUserCaseNotes.mockImplementation(v => v.caseNoteToUpsert);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue({
        role: ROLES.judge,
        userId: mockJudgeUser.userId,
      });

    const caseNote = await updateUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: mockCaseNote.docketNumber,
        notes: mockCaseNote.notes,
      },
      omit(mockUser, 'section'),
    );

    expect(caseNote).toBeDefined();
  });

  it('updates a case note associated with the current userId when there is no associated judge', async () => {
    const userIdToExpect = 'f922e1fc-567f-4f7d-b1f5-c9eec1567643';
    const mockUser = {
      ...mockJudgeUser,
      section: 'colvinChambers',
      userId: userIdToExpect,
    } as UnknownAuthUser;

    getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    await updateUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: mockCaseNote.docketNumber,
        notes: mockCaseNote.notes,
      },
      omit(mockUser, 'section'),
    );

    const userCaseNotesArgument = upsertUserCaseNotes.mock.calls[0][0];

    expect(userCaseNotesArgument[0].userId).toEqual(userIdToExpect);
  });
});
