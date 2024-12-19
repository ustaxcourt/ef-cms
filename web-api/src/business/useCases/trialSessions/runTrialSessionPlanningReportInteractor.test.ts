import {
  PreviousTerm,
  TrialLocationData,
} from '../../../../../shared/src/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { runTrialSessionPlanningReportInteractor } from './runTrialSessionPlanningReportInteractor';

describe('run trial session planning report', () => {
  const mockPdfUrl = 'www.example.com';

  const PREVIOUS_TERMS_MOCK: PreviousTerm[] = [
    { term: 'winter', termDisplay: 'Winter 2020', year: '2020' },
    { term: 'fall', termDisplay: 'Fall 2019', year: '2019' },
    { term: 'spring', termDisplay: 'Spring 2019', year: '2019' },
  ];

  const TRIAL_LOCATION_DATA_MOCK: TrialLocationData[] = [
    {
      allCaseCount: 1,
      blockedCaseCount: 5,
      lastVisitedDate: 'lastVisitedDate',
      previousTermsData: [],
      regularCaseCount: 2,
      smallCaseCount: 3,
      specialCaseCount: 4,
      stateAbbreviation: 'stateAbbreviation',
      trialCityState: 'trialCityState',
    },
  ];

  const getTrialSessionPlanningReportDataInteractorResults: {
    previousTerms: PreviousTerm[];
    trialLocationData: TrialLocationData[];
  } = {
    previousTerms: PREVIOUS_TERMS_MOCK,
    trialLocationData: TRIAL_LOCATION_DATA_MOCK,
  };

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getTrialSessionPlanningReportDataInteractor.mockReturnValue(
        getTrialSessionPlanningReportDataInteractorResults,
      );

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);

    applicationContext
      .getDocumentGenerators()
      .trialSessionPlanningReport.mockReturnValue('MOCKED_FILE');
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialCity.mockReturnValue([]);

    await expect(
      runTrialSessionPlanningReportInteractor(
        applicationContext,
        {
          term: 'winter',
          year: '2020',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow();
  });

  it('should save and generate PDF url with correct planning report data', async () => {
    const results = await runTrialSessionPlanningReportInteractor(
      applicationContext,
      {
        term: 'winter',
        year: '2020',
      },
      mockPetitionsClerkUser,
    );

    const getTrialSessionPlanningReportDataInteractorCalls =
      applicationContext.getUseCases()
        .getTrialSessionPlanningReportDataInteractor.mock.calls;

    expect(getTrialSessionPlanningReportDataInteractorCalls.length).toEqual(1);
    expect(getTrialSessionPlanningReportDataInteractorCalls[0][1]).toEqual({
      term: 'winter',
      year: '2020',
    });

    const trialSessionPlanningReportCalls =
      applicationContext.getDocumentGenerators().trialSessionPlanningReport.mock
        .calls;
    expect(trialSessionPlanningReportCalls.length).toEqual(1);
    expect(trialSessionPlanningReportCalls[0][0].data).toEqual({
      locationData: TRIAL_LOCATION_DATA_MOCK,
      previousTerms: PREVIOUS_TERMS_MOCK,
      term: 'Winter 2020',
    });

    const saveFileAndGenerateUrlCalls =
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl.mock.calls;
    expect(saveFileAndGenerateUrlCalls.length).toEqual(1);
    expect(saveFileAndGenerateUrlCalls[0][0]).toMatchObject({
      file: 'MOCKED_FILE',
      useTempBucket: true,
    });

    expect(results).toEqual(mockPdfUrl);
  });
});
