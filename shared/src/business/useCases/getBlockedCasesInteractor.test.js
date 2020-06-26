const { applicationContext } = require('../test/createTestApplicationContext');
const { getBlockedCasesInteractor } = require('./getBlockedCasesInteractor');
const { ROLES } = require('../entities/EntityConstants');

describe('getBlockedCasesInteractor', () => {
  it('calls search function with correct params and returns records', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    applicationContext.getPersistenceGateway().getBlockedCases.mockReturnValue([
      {
        caseId: '1',
      },
      {
        caseId: '2',
      },
    ]);

    const results = await getBlockedCasesInteractor({
      applicationContext,
      trialLocation: 'Boise, Idaho',
    });

    expect(results).toEqual([
      {
        caseId: '1',
      },
      {
        caseId: '2',
      },
    ]);
  });

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
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
