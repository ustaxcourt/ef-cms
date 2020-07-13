const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getCaseDeadlinesForCaseInteractor,
} = require('./getCaseDeadlinesForCaseInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { User } = require('../../entities/User');

describe('getCaseDeadlinesForCaseInteractor', () => {
  const mockCaseDeadline = {
    caseId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
  };

  const mockUser = new User({
    name: 'Test Petitionsclerk',
    role: ROLES.petitionsClerk,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  it('gets the case deadlines', async () => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByCaseId.mockReturnValue([mockCaseDeadline]);
    applicationContext.getUniqueId.mockReturnValue(
      '6ba578e7-5736-435b-a41b-2de3eec29fe7',
    );

    let error;
    let caseDeadlines;

    try {
      caseDeadlines = await getCaseDeadlinesForCaseInteractor({
        applicationContext,
        caseId: mockCaseDeadline.caseId,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseDeadlines).toBeDefined();
  });
});
