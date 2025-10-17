jest.mock('@web-api/persistence/postgres/users/getUsersInSections');
import { getUsersInSections as getUsersInSectionsMock } from '@web-api/persistence/postgres/users/getUsersInSections';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getJudgesForPublicSearchInteractor } from './getJudgesForPublicSearchInteractor';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('getJudgesForPublicSearchInteractor', () => {
  const getUsersInSections = jest.mocked(getUsersInSectionsMock);
  it('strips out all non public data', async () => {
    getUsersInSections.mockResolvedValue([
      {
        barNumber: 'should be filtered out',
        email: 'should be filtered out',
        isSeniorJudge: false,
        judgeFullName: 'Lila A. Fenwick',
        judgeTitle: 'Special Trial Judge',
        name: 'Lila A. Fenwick',
        role: ROLES.judge,
        userId: 'should be filtered out',
      } as DbUser,
      {
        barNumber: 'should be filtered out',
        email: 'should be filtered out',
        isSeniorJudge: false,
        judgeFullName: 'Stephanie Kulp Seymour',
        judgeTitle: 'Special Trial Judge',
        name: 'Stephanie Kulp Seymour',
        role: ROLES.judge,
        userId: 'should be filtered out',
      } as DbUser,
    ]);

    const results = await getJudgesForPublicSearchInteractor();

    expect(getUsersInSections).toHaveBeenCalledWith({
      sections: [ROLES.judge],
    });
    expect(results).toEqual([
      {
        entityName: 'PublicUser',
        judgeFullName: 'Lila A. Fenwick',
        judgeTitle: 'Special Trial Judge',
        name: 'Lila A. Fenwick',
        role: ROLES.judge,
      },
      {
        entityName: 'PublicUser',
        judgeFullName: 'Stephanie Kulp Seymour',
        judgeTitle: 'Special Trial Judge',
        name: 'Stephanie Kulp Seymour',
        role: ROLES.judge,
      },
    ]);
  });
});
