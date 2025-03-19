import { ROLES } from '@shared/business/entities/EntityConstants';
import { fetchCurrentJudgesAsOptionsForMinuteSheetAction } from './fetchCurrentJudgesAsOptionsForMinuteSheetAction';
import { getUsersInSectionInteractor } from '@shared/proxies/users/getUsersInSectionProxy';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

jest.mock('@shared/proxies/users/getUsersInSectionProxy');

describe('fetchCurrentJudgesAsOptionsForMinuteSheetAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted judge options when judges are found', async () => {
    const mockJudges = [
      {
        judgeFullName: 'Judge Smith',
        judgeTitle: 'Chief Judge',
        role: ROLES.judge,
        userId: 'judge1',
      },
      {
        judgeFullName: 'Judge Jones',
        judgeTitle: 'Judge',
        role: ROLES.judge,
        userId: 'judge2',
      },
    ];

    (getUsersInSectionInteractor as jest.Mock).mockResolvedValue(mockJudges);

    const result = await runAction(
      fetchCurrentJudgesAsOptionsForMinuteSheetAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(getUsersInSectionInteractor).toHaveBeenCalledWith(
      expect.anything(),
      {
        section: 'judge',
      },
    );
    expect(result.output.judgeOptions).toEqual({
      judge1: {
        fullName: 'Judge Smith',
        title: 'Chief Judge',
        userId: 'judge1',
      },
      judge2: {
        fullName: 'Judge Jones',
        title: 'Judge',
        userId: 'judge2',
      },
    });
  });

  it('should return empty object when no judges are found', async () => {
    (getUsersInSectionInteractor as jest.Mock).mockResolvedValue([]);

    const result = await runAction(
      fetchCurrentJudgesAsOptionsForMinuteSheetAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(result.output.judgeOptions).toEqual({});
  });

  it('should filter out legacy judges', async () => {
    const mockUsers = [
      {
        judgeFullName: 'Judge Smith',
        judgeTitle: 'Judge',
        role: ROLES.judge,
        userId: 'judge1',
      },
      {
        name: 'Judge Brown',
        role: ROLES.legacyJudge,
        userId: 'legacyJudge1',
      },
    ];

    (getUsersInSectionInteractor as jest.Mock).mockResolvedValue(mockUsers);

    const result = await runAction(
      fetchCurrentJudgesAsOptionsForMinuteSheetAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(result.output.judgeOptions).toEqual({
      judge1: {
        fullName: 'Judge Smith',
        title: 'Judge',
        userId: 'judge1',
      },
    });
  });
});
