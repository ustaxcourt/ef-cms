import { MOCK_CASE } from '../../../test/mockCase';
import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getUserCaseNoteForCasesInteractor } from './getUserCaseNoteForCasesInteractor';
import { omit } from 'lodash';

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
    section: 'colvinChambers',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  beforeEach(() => {
    mockCurrentUser = mockJudge;
    mockNote = MOCK_NOTE;
    applicationContext.getCurrentUser.mockImplementation(() =>
      omit(new User(mockCurrentUser), 'section'),
    );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockCurrentUser);
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNoteForCases.mockResolvedValue([mockNote]);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(mockJudge);
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
      section: 'colvinChambers',
      userId: userIdToExpect,
    });
    applicationContext.getCurrentUser.mockImplementation(() =>
      omit(mockUser, 'section'),
    );
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    await getUserCaseNoteForCasesInteractor(applicationContext, {
      docketNumbers: [MOCK_NOTE.docketNumber],
    });

    expect(
      applicationContext.getPersistenceGateway().getUserCaseNoteForCases.mock
        .calls[0][0].userId,
    ).toEqual(userIdToExpect);
  });
});
