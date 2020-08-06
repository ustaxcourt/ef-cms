const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateUserCaseNoteInteractor,
} = require('./updateUserCaseNoteInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('updateUserCaseNoteInteractor', () => {
  const mockCaseNote = {
    docketNumber: '123-45',
    notes: 'hello world',
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  };

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateUserCaseNoteInteractor({
        applicationContext,
        docketNumber: mockCaseNote.docketNumber,
        notes: mockCaseNote.notes,
      }),
    ).rejects.toThrow(new UnauthorizedError('Unauthorized'));
  });

  it('updates a case note', async () => {
    const mockUser = new User({
      name: 'Judge Armen',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .updateUserCaseNote.mockImplementation(v => v.caseNoteToUpdate);
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue({
        role: ROLES.judge,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });

    const caseNote = await updateUserCaseNoteInteractor({
      applicationContext,
      docketNumber: mockCaseNote.docketNumber,
      notes: mockCaseNote.notes,
    });

    expect(caseNote).toBeDefined();
  });
});
