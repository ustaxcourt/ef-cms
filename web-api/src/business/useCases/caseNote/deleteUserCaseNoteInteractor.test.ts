import '@web-api/persistence/postgres/userCaseNotes/mocks.jest';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { deleteUserCaseNoteInteractor } from './deleteUserCaseNoteInteractor';
import { deleteUserCaseNote as deleteUserCaseNoteMock } from '@web-api/persistence/postgres/userCaseNotes/deleteUserCaseNote';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';

describe('deleteUserCaseNoteInteractor', () => {
  const deleteUserCaseNote = deleteUserCaseNoteMock as jest.Mock;

  it('throws an error if the user is not valid or authorized', async () => {
    let user = {} as UnknownAuthUser;

    await expect(
      deleteUserCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        },
        user,
      ),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('deletes a case note', async () => {
    const mockUser = new User({
      email: 'email@example.com',
      name: 'Judge Colvin',
      role: ROLES.judge,
      section: 'colvinChambers',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    }) as UnknownAuthUser;
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);
    deleteUserCaseNote.mockImplementation(v => v);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue({
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    const caseNote = await deleteUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
      },
      omit(mockUser, 'section'),
    );

    expect(caseNote).toBeDefined();
  });

  it('deletes a case note associated with the current userId when there is no associated judge', async () => {
    const mockUser = {
      ...mockJudgeUser,
      section: 'colvinChambers',
    } as UnknownAuthUser;
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);
    await deleteUserCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: '123-45',
      },
      omit(mockUser, 'section'),
    );

    expect(deleteUserCaseNote.mock.calls[0][0].userId).toEqual(
      mockJudgeUser.userId,
    );
  });
});
