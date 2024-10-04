import '@web-api/persistence/postgres/userCaseNotes/mocks.jest';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';
import { updateUserCaseNoteInteractor } from './updateUserCaseNoteInteractor';
import { updateUserCaseNote as updateUserCaseNoteMock } from '@web-api/persistence/postgres/userCaseNotes/updateUserCaseNote';

describe('updateUserCaseNoteInteractor', () => {
  const mockCaseNote = {
    docketNumber: '123-45',
    notes: 'hello world',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const updateUserCaseNote = updateUserCaseNoteMock as jest.Mock;

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
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    updateUserCaseNote.mockImplementation(v => v.caseNoteToUpdate);
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

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
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

    expect(updateUserCaseNote.mock.calls[0][0].caseNoteToUpdate.userId).toEqual(
      userIdToExpect,
    );
  });
});
