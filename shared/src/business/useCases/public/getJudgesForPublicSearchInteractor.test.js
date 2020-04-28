const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getJudgesForPublicSearchInteractor,
} = require('./getJudgesForPublicSearchInteractor');
const { User } = require('../../entities/User');

describe('getJudgesForPublicSearchInteractor', () => {
  it('strips out all non public data', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue([
        {
          barNumber: 'should be filtered out',
          email: 'should be filtered out',
          judgeFullName: 'Lila A. Fenwick',
          judgeTitle: 'Special Trial Judge',
          name: 'Lila A. Fenwick',
          role: 'judge',
          userId: 'should be filtered out',
        },
        {
          barNumber: 'should be filtered out',
          email: 'should be filtered out',
          judgeFullName: 'Stephanie Kulp Seymour',
          judgeTitle: 'Special Trial Judge',
          name: 'Stephanie Kulp Seymour',
          role: 'judge',
          userId: 'should be filtered out',
        },
      ]);

    const results = await getJudgesForPublicSearchInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().getUsersInSection,
    ).toHaveBeenCalledWith({ applicationContext, section: User.ROLES.judge });
    expect(results).toEqual([
      {
        judgeFullName: 'Lila A. Fenwick',
        judgeTitle: 'Special Trial Judge',
        name: 'Lila A. Fenwick',
        role: 'judge',
      },
      {
        judgeFullName: 'Stephanie Kulp Seymour',
        judgeTitle: 'Special Trial Judge',
        name: 'Stephanie Kulp Seymour',
        role: 'judge',
      },
    ]);
  });
});
