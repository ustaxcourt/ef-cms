const { omit } = require('lodash');
const { TrialSession } = require('../../entities/TrialSession');
const { validateTrialSession } = require('./validateTrialSessionInteractor');

describe('validateTrialSession', () => {
  it('returns the expected errors object on an empty trial session', () => {
    const errors = validateTrialSession({
      applicationContext: {
        getEntityConstructors: () => ({
          TrialSession,
        }),
      },
      trialSession: {},
    });

    expect(Object.keys(errors)).toEqual(
      Object.keys(
        omit(TrialSession.errorToMessageMap, ['postalCode', 'swingSessionId']),
      ),
    );
  });
});
