const {
  getCaseDeadlinesForCaseInteractor,
} = require('./getCaseDeadlinesForCaseInteractor');
const { User } = require('../../entities/User');

describe('getCaseDeadlinesForCaseInteractor', () => {
  let applicationContext;

  const mockCaseDeadline = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    caseTitle: 'My Case Title',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '101-21',
  };

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
        getCaseDeadlinesByCaseId: () => [mockCaseDeadline],
      }),
      getUniqueId: () => '6ba578e7-5736-435b-a41b-2de3eec29fe7',
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
