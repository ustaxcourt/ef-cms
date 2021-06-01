const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  canSetTrialSessionAsCalendaredInteractor,
} = require('./canSetTrialSessionAsCalendaredInteractor');
const {
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');

const MOCK_TRIAL = {
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

let user;

describe('canSetTrialSessionAsCalendaredInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('throws an error if a user is unauthorized', () => {
    user = {
      role: 'unauthorizedRole',
      userId: 'unauthorizedUser',
    };

    expect(() =>
      canSetTrialSessionAsCalendaredInteractor(applicationContext, {
        trialSession: MOCK_TRIAL,
      }),
    ).toThrow('Unauthorized');
  });

  it('gets the result back from the interactor', () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };

    applicationContext.getUniqueId.mockReturnValue('easy-as-abc-123');

    const result = canSetTrialSessionAsCalendaredInteractor(
      applicationContext,
      {
        trialSession: MOCK_TRIAL,
      },
    );

    expect(result).toEqual({
      canSetAsCalendared: false,
      emptyFields: ['address1', 'city', 'state', 'postalCode', 'judge'],
    });
  });
});
