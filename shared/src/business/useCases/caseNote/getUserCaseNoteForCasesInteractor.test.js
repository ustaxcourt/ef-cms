const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getUserCaseNoteForCasesInteractor,
} = require('./getUserCaseNoteForCasesInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { omit } = require('lodash');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getUserCaseNoteForCasesInteractor', () => {
  let mockCurrentUser;
  let mockNote;

  const MOCK_NOTE = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'something',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  const mockJudge = {
    role: ROLES.judge,
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  beforeEach(() => {
    mockCurrentUser = mockJudge;
    mockNote = MOCK_NOTE;

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNoteForCases.mockResolvedValue([mockNote]);
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue(mockJudge);
  });

  it('throws error if user is unauthorized', async () => {
    mockCurrentUser = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    await expect(
      getUserCaseNoteForCasesInteractor(applicationContext, {
        docketNumbers: [MOCK_NOTE.docketNumber],
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNoteForCases.mockResolvedValue([omit(MOCK_NOTE, 'userId')]);

    await expect(
      getUserCaseNoteForCasesInteractor(applicationContext, {
        docketNumbers: [MOCK_NOTE.docketNumber],
      }),
    ).rejects.toThrow('The UserCaseNote entity was invalid');
  });

  it('correctly returns data from persistence', async () => {
    const result = await getUserCaseNoteForCasesInteractor(applicationContext, {
      docketNumbers: [MOCK_NOTE.docketNumber],
    });

    expect(result).toMatchObject([MOCK_NOTE]);
  });

  it('uses the current user userId when there is no associated judge', async () => {
    const userIdToExpect = 'f922e1fc-567f-4f7d-b1f5-c9eec1567643';
    const mockUser = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      userId: userIdToExpect,
    });
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext.getUseCases.mockReturnValue({
      getJudgeForUserChambersInteractor: () => null,
    });

    await getUserCaseNoteForCasesInteractor(applicationContext, {
      docketNumbers: [MOCK_NOTE.docketNumber],
    });

    expect(
      applicationContext.getPersistenceGateway().getUserCaseNoteForCases.mock
        .calls[0][0].userId,
    ).toEqual(userIdToExpect);
  });
});
