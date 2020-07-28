const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getUserCaseNoteInteractor } = require('./getUserCaseNoteInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { omit } = require('lodash');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('Get case note', () => {
  const MOCK_NOTE = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'something',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  const mockUnauthorizedUser = {
    role: 'unauthorizedRole',
    userId: 'unauthorizedUser',
  };

  const mockJudge = {
    role: ROLES.judge,
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockUnauthorizedUser);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNote.mockReturnValue({});

    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => null,
    });

    await expect(
      getUserCaseNoteInteractor({
        applicationContext,
        docketNumber: MOCK_NOTE.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockJudge);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNote.mockResolvedValue(omit(MOCK_NOTE, 'userId'));
    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => mockJudge,
    });

    await expect(
      getUserCaseNoteInteractor({
        applicationContext,
        docketNumber: MOCK_NOTE.docketNumber,
      }),
    ).rejects.toThrow('The UserCaseNote entity was invalid');
  });

  it('correctly returns data from persistence', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockJudge);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNote.mockResolvedValue(MOCK_NOTE);

    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => mockJudge,
    });

    const result = await getUserCaseNoteInteractor({
      applicationContext,
      docketNumber: MOCK_NOTE.docketNumber,
    });

    expect(result).toMatchObject(MOCK_NOTE);
  });

  it('does not return anything if nothing is returned from persistence', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockJudge);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNote.mockReturnValue(null);
    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => mockJudge,
    });

    const result = await getUserCaseNoteInteractor({
      applicationContext,
      docketNumber: MOCK_NOTE.docketNumber,
    });

    expect(result).toEqual(undefined);
  });
});
