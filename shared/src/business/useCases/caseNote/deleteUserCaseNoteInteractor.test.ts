import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteUserCaseNoteInteractor } from './deleteUserCaseNoteInteractor';
import { omit } from 'lodash';

describe('deleteUserCaseNoteInteractor', () => {
  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      deleteUserCaseNoteInteractor(applicationContext, {
        docketNumber: '123-45',
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('deletes a case note', async () => {
    const mockUser = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      section: 'colvinChambers',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(
      omit(mockUser, 'section'),
    );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);
    applicationContext.getPersistenceGateway().deleteUserCaseNote = v => v;
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue({
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    const caseNote = await deleteUserCaseNoteInteractor(applicationContext, {
      docketNumber: '123-45',
    });

    expect(caseNote).toBeDefined();
  });

  it('deletes a case note associated with the current userId when there is no associated judge', async () => {
    const mockUser = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      section: 'colvinChambers',
      userId: '123456',
    });
    applicationContext.getCurrentUser.mockReturnValue(
      omit(mockUser, 'section'),
    );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);
    applicationContext.getPersistenceGateway().deleteUserCaseNote = jest.fn();
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);
    await deleteUserCaseNoteInteractor(applicationContext, {
      docketNumber: '123-45',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserCaseNote.mock
        .calls[0][0].userId,
    ).toEqual('123456');
  });
});
