const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getAllCaseDeadlinesInteractor,
} = require('./getAllCaseDeadlinesInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getAllCaseDeadlinesInteractor', () => {
  const mockDeadlines = [];

  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext
      .getPersistenceGateway()
      .getAllCaseDeadlines.mockReturnValue(mockDeadlines);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue(new User({}));

    let error;
    let caseDeadlines;

    try {
      caseDeadlines = await getAllCaseDeadlinesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(caseDeadlines).toBeUndefined();
  });

  it('gets all the case deadlines', async () => {
    const mockPetitionsClerk = new User({
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    let error;
    let caseDeadlines;

    try {
      caseDeadlines = await getAllCaseDeadlinesInteractor({
        applicationContext,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(caseDeadlines).toEqual(mockDeadlines);
  });
});
