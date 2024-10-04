import '@web-api/persistence/postgres/userCaseNotes/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserCaseNoteForCasesInteractor } from './getUserCaseNoteForCasesInteractor';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { omit } from 'lodash';

describe('getUserCaseNoteForCasesInteractor', () => {
  let mockCurrentUser: UnknownAuthUser;
  let mockNote;

  const MOCK_NOTE = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'something',
    userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
  };

  const mockJudge = {
    ...mockJudgeUser,
    section: 'colvinChambers',
  } as UnknownAuthUser;

  beforeEach(() => {
    mockCurrentUser = mockJudge;
    mockNote = MOCK_NOTE;
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
    } as unknown as UnknownAuthUser;
    await expect(
      getUserCaseNoteForCasesInteractor(
        applicationContext,
        {
          docketNumbers: [MOCK_NOTE.docketNumber],
        },
        omit(mockCurrentUser, 'section'),
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserCaseNoteForCases.mockResolvedValue([omit(MOCK_NOTE, 'userId')]);

    await expect(
      getUserCaseNoteForCasesInteractor(
        applicationContext,
        {
          docketNumbers: [MOCK_NOTE.docketNumber],
        },
        mockCurrentUser,
      ),
    ).rejects.toThrow('The UserCaseNote entity was invalid');
  });

  it('correctly returns data from persistence', async () => {
    const result = await getUserCaseNoteForCasesInteractor(
      applicationContext,
      {
        docketNumbers: [MOCK_NOTE.docketNumber],
      },
      mockCurrentUser,
    );

    expect(result).toMatchObject([MOCK_NOTE]);
  });

  it('uses the current user userId when there is no associated judge', async () => {
    const userIdToExpect = 'f922e1fc-567f-4f7d-b1f5-c9eec1567643';
    const mockUser = {
      ...mockJudge,
      userId: userIdToExpect,
    } as UnknownAuthUser;
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUser);
    applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper.mockReturnValue(null);

    await getUserCaseNoteForCasesInteractor(
      applicationContext,
      {
        docketNumbers: [MOCK_NOTE.docketNumber],
      },
      omit(mockUser, 'section'),
    );

    expect(
      applicationContext.getPersistenceGateway().getUserCaseNoteForCases.mock
        .calls[0][0].userId,
    ).toEqual(userIdToExpect);
  });
});
