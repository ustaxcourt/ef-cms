const {
  setTrialSessionCalendarInteractor,
} = require('./setTrialSessionCalendarInteractor');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('setTrialSessionCalendarInteractor', () => {
  let applicationContext;

  it('throws an exception when there is a permissions issue', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Petitioner',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
        getTrialSessionById: () => MOCK_TRIAL,
        updateCase: () => {},
        updateTrialSession: () => {},
      }),
    };

    let error;

    try {
      await setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should set a trial session to "calendared"', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
        getTrialSessionById: () => MOCK_TRIAL,
        updateCase: () => {},
        updateTrialSession: () => {},
      }),
    };

    let error;

    try {
      await setTrialSessionCalendarInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
