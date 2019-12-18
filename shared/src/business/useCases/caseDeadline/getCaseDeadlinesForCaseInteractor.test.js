const {
  getCaseDeadlinesForCaseInteractor,
} = require('./getCaseDeadlinesForCaseInteractor');
const { User } = require('../../entities/User');

describe('getCaseDeadlinesForCaseInteractor', () => {
  let applicationContext;

  it('gets the case deadlines', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () =>
        new User({
          name: 'Test Petitionsclerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        }),
      getPersistenceGateway: () => ({
        getCaseDeadlinesByCaseId: v => v,
      }),
    };

    let error;
    let caseDeadlines;

    try {
      caseDeadlines = await getCaseDeadlinesForCaseInteractor({
        applicationContext,
        caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseDeadlines).toBeDefined();
  });
});
