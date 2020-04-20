const { applicationContext } = require('../test/createTestApplicationContext');
const { getBlockedCasesInteractor } = require('./getBlockedCasesInteractor');
const { User } = require('../entities/User');

describe('getBlockedCasesInteractor', () => {
  it('calls search function with correct params and returns records', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    applicationContext.getSearchClient().search.mockReturnValue({
      hits: {
        hits: [
          {
            _source: {
              caseId: { S: '1' },
            },
          },
          {
            _source: {
              caseId: { S: '2' },
            },
          },
        ],
      },
    });

    const results = await getBlockedCasesInteractor({
      applicationContext,
      trialLocation: 'Boise, Idaho',
    });

    expect(applicationContext.getSearchClient().search).toHaveBeenCalled();
    expect(
      applicationContext.getSearchClient().search.mock.calls[0][0].body.query
        .bool.must,
    ).toEqual([
      { match: { 'preferredTrialCity.S': 'Boise, Idaho' } },
      {
        bool: {
          should: [
            { match: { 'automaticBlocked.BOOL': true } },
            { match: { 'blocked.BOOL': true } },
          ],
        },
      },
    ]);
    expect(results).toEqual([{ caseId: '1' }, { caseId: '2' }]);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });

    let error;
    try {
      await getBlockedCasesInteractor({
        applicationContext,
        trialLocation: 'Boise, Idaho',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
