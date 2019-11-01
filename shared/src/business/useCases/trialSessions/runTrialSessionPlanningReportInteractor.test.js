const sinon = require('sinon');
const {
  getPreviousTerm,
  getTrialSessionPlanningReportData,
  runTrialSessionPlanningReportInteractor,
} = require('./runTrialSessionPlanningReportInteractor');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { User } = require('../../entities/User');

describe('run trial session planning report', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getEligibleCasesForTrialCity: sinon.stub().returns([]),
        };
      },
    };
    await expect(
      runTrialSessionPlanningReportInteractor({
        applicationContext,
        term: 'winter',
        year: '2020',
      }),
    ).rejects.toThrow();
  });

  it('returns previous terms and the trial locations and case counts', async () => {
    const getEligibleCasesForTrialCityStub = sinon
      .stub()
      .returns([{ caseId: '123' }, { caseId: '123' }]);
    const getTrialSessionsStub = sinon.stub().returns([
      {
        judge: { name: 'Judge Armen' },
        sessionType: 'Regular',
        term: 'spring',
        termYear: '2020',
        trialLocation: 'Birmingham, Alabama',
        trialSessionId: '123',
      },
    ]);
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsClerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getEligibleCasesForTrialCity: getEligibleCasesForTrialCityStub,
          getTrialSessions: getTrialSessionsStub,
        };
      },
    };
    const results = await getTrialSessionPlanningReportData({
      applicationContext,
      term: 'winter',
      year: '2020',
    });

    expect(results.previousTerms).toMatchObject([
      { term: 'fall', year: '2020' },
      { term: 'spring', year: '2020' },
      { term: 'winter', year: '2019' },
    ]);
    expect(results.trialLocationData.length).toEqual(
      TrialSession.TRIAL_CITIES.ALL.length,
    );
    expect(results.trialLocationData[0]).toMatchObject({
      allCaseCount: 4,
      previousTermsData: ['', '(R) Armen', ''],
      regularCaseCount: 2,
      smallCaseCount: 2,
      stateAbbreviation: 'AL',
      trialCityState: 'Birmingham, Alabama',
    });
  });

  describe('get previous term', () => {
    it('returns previous term and same year if the previous term is winter', () => {
      const result = getPreviousTerm('winter', '2020');
      expect(result).toEqual({ term: 'fall', year: '2020' });
    });
    it('returns previous term and same year if the previous term is fall', () => {
      const result = getPreviousTerm('fall', '2020');
      expect(result).toEqual({ term: 'spring', year: '2020' });
    });
    it('returns previous term and previous year if the previous term is spring', () => {
      const result = getPreviousTerm('spring', '2020');
      expect(result).toEqual({ term: 'winter', year: '2019' });
    });
  });
});
