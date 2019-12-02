const {
  NewTrialSession,
} = require('../../entities/trialSessions/NewTrialSession');
const {
  validateTrialSessionInteractor,
} = require('./validateTrialSessionInteractor');
const { omit } = require('lodash');

describe('validateTrialSessionInteractor', () => {
  it('returns the expected errors object on an empty trial session', () => {
    const errors = validateTrialSessionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          NewTrialSession,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      trialSession: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(NewTrialSession.VALIDATION_ERROR_MESSAGES, [
          'postalCode',
          'swingSessionId',
          'startTime',
        ]),
      ),
    );
  });

  it('returns null for a valid trial session', () => {
    const MOCK_TRIAL = {
      maxCases: 100,
      sessionType: 'Regular',
      startDate: '2020-12-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2020',
      trialLocation: 'Birmingham, AL',
    };

    const errors = validateTrialSessionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          NewTrialSession,
        }),
        getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      trialSession: { ...MOCK_TRIAL },
    });

    expect(errors).toEqual(null);
  });
});
