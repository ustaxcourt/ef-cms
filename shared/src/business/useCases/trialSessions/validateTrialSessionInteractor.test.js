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
      },
      trialSession: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(NewTrialSession.errorToMessageMap, [
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
      startDate: '2019-12-01T00:00:00.000Z',
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Birmingham, AL',
    };

    const errors = validateTrialSessionInteractor({
      applicationContext: {
        getEntityConstructors: () => ({
          NewTrialSession,
        }),
      },
      trialSession: { ...MOCK_TRIAL },
    });

    expect(errors).toEqual(null);
  });
});
