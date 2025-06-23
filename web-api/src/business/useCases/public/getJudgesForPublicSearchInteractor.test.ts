import '@web-api/persistence/postgres/users/mocks.jest';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { getJudgesForPublicSearchInteractor } from './getJudgesForPublicSearchInteractor';
import { getUsersInSections as getUsersInSectionMock } from '@web-api/persistence/postgres/users/getUsersInSections';

const getUsersInSection = getUsersInSectionMock as jest.Mock;

describe('getJudgesForPublicSearchInteractor', () => {
  it('strips out all non public data', async () => {
    getUsersInSection.mockReturnValue([
      {
        barNumber: 'should be filtered out',
        email: 'should be filtered out',
        isSeniorJudge: false,
        judgeFullName: 'Lila A. Fenwick',
        judgeTitle: 'Special Trial Judge',
        name: 'Lila A. Fenwick',
        role: ROLES.judge,
        userId: 'should be filtered out',
      },
      {
        barNumber: 'should be filtered out',
        email: 'should be filtered out',
        isSeniorJudge: false,
        judgeFullName: 'Stephanie Kulp Seymour',
        judgeTitle: 'Special Trial Judge',
        name: 'Stephanie Kulp Seymour',
        role: ROLES.judge,
        userId: 'should be filtered out',
      },
    ]);

    const results = await getJudgesForPublicSearchInteractor();

    expect(getUsersInSection).toHaveBeenCalledWith({ section: ROLES.judge });
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
