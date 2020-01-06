const sinon = require('sinon');
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
          role: User.ROLES.petitioner,
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
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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

  it('should set a trial session to "calendared" and calendar all cases that have been QCed', async () => {
    let updateTrialSession = sinon.spy();
    let updateCaseSpy = sinon.spy();

    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getCalendaredCasesForTrialSession: () => [
          {
            ...MOCK_CASE,
            caseId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            docketNumber: '102-19',
            qcCompleteForTrial: {
              '6805d1ab-18d0-43ec-bafb-654e83405416': true,
            },
          },
        ],
        getEligibleCasesForTrialSession: () => [
          {
            ...MOCK_CASE,
            qcCompleteForTrial: {
              '6805d1ab-18d0-43ec-bafb-654e83405416': true,
            },
          },
        ],
        getTrialSessionById: () => MOCK_TRIAL,
        updateCase: updateCaseSpy,
        updateTrialSession,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseSpy.called).toEqual(true);
  });

  it('should NOT set a trial session to "calendared" and calendar all cases that have been QCed', async () => {
    let updateTrialSession = sinon.spy();
    let updateCaseSpy = sinon.spy();
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        deleteCaseTrialSortMappingRecords: () => {},
        getCalendaredCasesForTrialSession: () => [
          {
            ...MOCK_CASE,
            caseId: '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
            docketNumber: '102-19',
            qcCompleteForTrial: {
              '6805d1ab-18d0-43ec-bafb-654e83405416': false,
            },
          },
        ],
        getEligibleCasesForTrialSession: () => [
          {
            ...MOCK_CASE,
            qcCompleteForTrial: {
              '6805d1ab-18d0-43ec-bafb-654e83405416': false,
            },
          },
        ],
        getTrialSessionById: () => MOCK_TRIAL,
        updateCase: () => {},
        updateTrialSession,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    await setTrialSessionCalendarInteractor({
      applicationContext,
      trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(updateCaseSpy.called).toEqual(false);
  });
});
