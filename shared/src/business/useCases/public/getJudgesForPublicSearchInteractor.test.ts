import { ROLES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getJudgesForPublicSearchInteractor } from './getJudgesForPublicSearchInteractor';

describe('getJudgesForPublicSearchInteractor', () => {
  it('strips out all non public data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([
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

    const results =
      await getJudgesForPublicSearchInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getUsersInSection,
    ).toHaveBeenCalledWith({ applicationContext, section: ROLES.judge });
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
