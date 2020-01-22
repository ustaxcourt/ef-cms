const {
  canSetTrialSessionAsCalendaredInteractor,
} = require('./canSetTrialSessionAsCalendaredInteractor');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('canSetTrialSessionAsCalendaredInteractor', () => {
  let applicationContext;

  it('throws an error if a user is unauthorized', () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'unauthorizedRole',
          userId: 'unauthorizedUser',
        };
      },
    };

    let error;

    try {
      canSetTrialSessionAsCalendaredInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });

  it('gets the result back from the interactor', () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getEntityConstructors: () => ({
        TrialSession,
      }),
      getUniqueId: () => 'easy-as-abc-123',
    };

    const result = canSetTrialSessionAsCalendaredInteractor({
      applicationContext,
      trialSession: MOCK_TRIAL,
    });

    expect(result).toEqual(false);
  });
});
