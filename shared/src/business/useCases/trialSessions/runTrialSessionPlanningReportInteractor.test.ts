import { ROLES, TRIAL_CITIES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { runTrialSessionPlanningReportInteractor } from './runTrialSessionPlanningReportInteractor';

describe('run trial session planning report', () => {
  const mockPdfUrl = 'www.example.com';
  let user;

  beforeEach(() => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    };
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialCity.mockResolvedValue([
        { docketNumber: '123-20' },
        { docketNumber: '234-20' },
      ]);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue([]);
  });

  it('throws error if user is unauthorized', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialCity.mockReturnValue([]);

    await expect(
      runTrialSessionPlanningReportInteractor(applicationContext, {
        term: 'winter',
        year: '2020',
      }),
    ).rejects.toThrow();
  });

  it('returns previous terms and the trial locations and case counts', async () => {
    let mockTrialSessions = [
      {
        judge: { name: 'Judge Colvin' },
        sessionType: 'Regular',
        startDate: '2019-05-01T21:40:46.415Z',
        term: 'spring',
        termYear: '2019',
        trialLocation: 'Aberdeen, South Dakota',
        trialSessionId: '123',
      },
      {
        judge: { name: 'Judge Buch' },
        sessionType: 'Small',
        startDate: '2019-04-01T21:40:46.415Z',
        term: 'spring',
        termYear: '2019',
        trialLocation: 'Aberdeen, South Dakota',
        trialSessionId: '234',
      },
      {
        //judge is missing, so this one should not show up in the list
        sessionType: 'Small',
        startDate: '2019-06-01T21:40:46.415Z',
        term: 'spring',
        termYear: '2019',
        trialLocation: 'Aberdeen, South Dakota',
        trialSessionId: '234',
      },
      {
        judge: { name: 'Judge Ashford' },
        sessionType: 'Small',
        startDate: '2019-09-01T21:40:46.415Z',
        term: 'fall',
        termYear: '2019',
        trialLocation: 'Aberdeen, South Dakota',
        trialSessionId: '345',
      },
      {
        judge: { name: 'Judge Ashford' },
        sessionType: 'Special',
        startDate: '2019-10-01T21:40:46.415Z',
        term: 'fall',
        termYear: '2019',
        trialLocation: 'Aberdeen, South Dakota',
        trialSessionId: '456',
      },
      {
        judge: { name: 'Judge Ashford' },
        sessionType: 'Hybrid-S',
        startDate: '2019-11-11T21:40:40.415Z',
        term: 'fall',
        termYear: '2019',
        trialLocation: 'Albany, New York',
        trialSessionId: '888',
      },
    ];
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockResolvedValue(mockTrialSessions);

    const result = await runTrialSessionPlanningReportInteractor(
      applicationContext,
      {
        term: 'winter',
        year: '2020',
      },
    );

    expect(
      applicationContext.getDocumentGenerators().trialSessionPlanningReport.mock
        .calls[0][0].data.locationData.length,
    ).toEqual(TRIAL_CITIES.ALL.length);
    expect(
      applicationContext.getDocumentGenerators().trialSessionPlanningReport.mock
        .calls[0][0].data.locationData[0],
    ).toMatchObject({
      allCaseCount: 4,
      previousTermsData: [['(S) Ashford'], ['(S) Buch', '(R) Colvin'], []],
      regularCaseCount: 2,
      smallCaseCount: 2,
      stateAbbreviation: 'SD',
      trialCityState: 'Aberdeen, South Dakota',
    });
    expect(
      applicationContext.getDocumentGenerators().trialSessionPlanningReport.mock
        .calls[0][0].data.locationData[1],
    ).toMatchObject({
      allCaseCount: 4,
      previousTermsData: [['(HS) Ashford'], [], []],
      regularCaseCount: 2,
      smallCaseCount: 2,
      stateAbbreviation: 'NY',
      trialCityState: 'Albany, New York',
    });
    expect(result).toBe(mockPdfUrl);
    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toHaveBeenCalled();
  });

  it('sorts trial locations by city', async () => {
    await runTrialSessionPlanningReportInteractor(applicationContext, {
      term: 'winter',
      year: '2020',
    });

    const actualtrialLocationData =
      applicationContext.getDocumentGenerators().trialSessionPlanningReport.mock
        .calls[0][0].data.locationData;
    expect(actualtrialLocationData[0].trialCityState).toEqual(
      'Aberdeen, South Dakota',
    );
    expect(actualtrialLocationData[1].trialCityState).toEqual(
      'Albany, New York',
    );
    expect(
      actualtrialLocationData[actualtrialLocationData.length - 1]
        .trialCityState,
    ).toEqual('Winston-Salem, North Carolina');
  });

  describe('previous terms', () => {
    it('returns previous terms when the term is winter', async () => {
      await runTrialSessionPlanningReportInteractor(applicationContext, {
        term: 'winter',
        year: '2020',
      });

      expect(
        applicationContext.getDocumentGenerators().trialSessionPlanningReport
          .mock.calls[0][0].data.previousTerms,
      ).toEqual([
        { term: 'fall', termDisplay: 'Fall 2019', year: '2019' },
        { term: 'spring', termDisplay: 'Spring 2019', year: '2019' },
        { term: 'winter', termDisplay: 'Winter 2019', year: '2019' },
      ]);
    });

    it('returns previous terms when the term is fall', async () => {
      await runTrialSessionPlanningReportInteractor(applicationContext, {
        term: 'fall',
        year: '2020',
      });

      expect(
        applicationContext.getDocumentGenerators().trialSessionPlanningReport
          .mock.calls[0][0].data.previousTerms,
      ).toEqual([
        { term: 'spring', termDisplay: 'Spring 2020', year: '2020' },
        { term: 'winter', termDisplay: 'Winter 2020', year: '2020' },
        { term: 'fall', termDisplay: 'Fall 2019', year: '2019' },
      ]);
    });

    it('returns previous terms when the term is spring', async () => {
      await runTrialSessionPlanningReportInteractor(applicationContext, {
        term: 'spring',
        year: '2020',
      });

      expect(
        applicationContext.getDocumentGenerators().trialSessionPlanningReport
          .mock.calls[0][0].data.previousTerms,
      ).toEqual([
        { term: 'winter', termDisplay: 'Winter 2020', year: '2020' },
        { term: 'fall', termDisplay: 'Fall 2019', year: '2019' },
        { term: 'spring', termDisplay: 'Spring 2019', year: '2019' },
      ]);
    });
  });
});
