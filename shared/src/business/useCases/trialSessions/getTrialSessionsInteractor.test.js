const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getTrialSessionsInteractor } = require('./getTrialSessionsInteractor');
const { omit } = require('lodash');
const { ROLES } = require('../../entities/EntityConstants');

const MOCK_TRIAL_SESSION = {
  maxCases: 100,
  proceedingType: 'Remote',
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2001',
  trialLocation: 'Birmingham, Alabama',
};

describe('Get trial sessions', () => {
  it('throws error if user is unauthorized', async () => {
    applicationContext.getUniqueId.mockReturnValue(
      'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    );

    await expect(
      getTrialSessionsInteractor(applicationContext),
    ).rejects.toThrow();
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockImplementation(() =>
        Promise.resolve([omit(MOCK_TRIAL_SESSION, 'maxCases')]),
      );
    let error;

    try {
      await getTrialSessionsInteractor(applicationContext);
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('The TrialSession entity was invalid');
  });

  it('calls getClosedTrialSessions when the requested status is "Closed"', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getClosedTrialSessions.mockImplementation(() =>
        Promise.resolve([MOCK_TRIAL_SESSION]),
      );

    await getTrialSessionsInteractor(applicationContext, { status: 'Closed' });

    expect(
      applicationContext.getPersistenceGateway().getClosedTrialSessions,
    ).toHaveBeenCalled();
  });

  it('calls getNewTrialSessions when the requested status is "New"', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getNewTrialSessions.mockImplementation(() =>
        Promise.resolve([MOCK_TRIAL_SESSION]),
      );

    await getTrialSessionsInteractor(applicationContext, { status: 'New' });

    expect(
      applicationContext.getPersistenceGateway().getNewTrialSessions,
    ).toHaveBeenCalled();
  });

  it('calls getOpenTrialSessions when the requested status is "Open"', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getOpenTrialSessions.mockImplementation(() =>
        Promise.resolve([MOCK_TRIAL_SESSION]),
      );

    await getTrialSessionsInteractor(applicationContext, { status: 'Open' });

    expect(
      applicationContext.getPersistenceGateway().getOpenTrialSessions,
    ).toHaveBeenCalled();
  });

  it('calls getTrialSessions when the requested status is "All"', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockImplementation(() =>
        Promise.resolve([MOCK_TRIAL_SESSION]),
      );

    await getTrialSessionsInteractor(applicationContext, { status: 'All' });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
  });

  it('calls getTrialSessions when the requested status is not defined', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => {
      return {
        role: ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockImplementation(() =>
        Promise.resolve([MOCK_TRIAL_SESSION]),
      );

    await getTrialSessionsInteractor(applicationContext, { status: undefined });

    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
  });
});
