import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialSessionPlanningReportViewHelper as trialSessionPlanningReportViewHelperComputed } from '@web-client/presenter/computeds/trialSessionPlanningReportViewHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('trialSessionPlanningReportViewHelper', () => {
  const trialSessionPlanningReportViewHelper = withAppContextDecorator(
    trialSessionPlanningReportViewHelperComputed,
    applicationContext,
  );

  const BASE_STATE = {
    previousTerms: [],
    trialLocationData: [],
  };

  it('should not throw an error running the helper', () => {
    expect(() =>
      runCompute(trialSessionPlanningReportViewHelper, {
        state: {
          trialSessionPlanningReportData: {
            ...BASE_STATE,
          },
        },
      } as any),
    ).not.toThrow();
  });

  describe('citiesNotCalendaredInTwoPreviousTerms', () => {
    it('should return the expected cities that have not been calendared in past 2 terms', () => {
      const { citiesNotCalendaredInTwoPreviousTerms } = runCompute(
        trialSessionPlanningReportViewHelper,
        {
          state: {
            trialSessionPlanningReportData: {
              ...BASE_STATE,
              trialLocationData: [
                {
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_4',
                },
                {
                  previousTermsData: [[], [], []],
                  trialCityState: 'TEST_CITY_STATE_1',
                },
                {
                  previousTermsData: [[], [{}], []],
                  trialCityState: 'TEST_CITY_STATE_2',
                },
                {
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_6',
                },
                {
                  previousTermsData: [[], [], []],
                  trialCityState: 'TEST_CITY_STATE_3',
                },

                {
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_5',
                },
                {
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_7',
                },
                {
                  previousTermsData: [[{}], [], []],
                  trialCityState: 'TEST_CITY_STATE_0',
                },
              ],
            },
          },
        } as any,
      );

      expect(citiesNotCalendaredInTwoPreviousTerms).toEqual([
        ['TEST_CITY_STATE_1', 'TEST_CITY_STATE_3'],
        ['TEST_CITY_STATE_4', 'TEST_CITY_STATE_5'],
        ['TEST_CITY_STATE_6'],
        ['TEST_CITY_STATE_7'],
      ]);
    });
  });

  describe('trialSessionPlanningReportHeader', () => {
    it('should return the correct header', () => {
      const { trialSessionPlanningReportHeader } = runCompute(
        trialSessionPlanningReportViewHelper,
        {
          state: {
            trialSessionPlanningReportData: {
              ...BASE_STATE,
              trialTerm: 'TEST_TRIAL_TERM',
              trialYear: 'TEST_TRIAL_YEAR',
            },
          },
        } as any,
      );

      expect(trialSessionPlanningReportHeader).toEqual(
        'Test_trial_term TEST_TRIAL_YEAR',
      );
    });
  });

  describe('previousTermsFormatted', () => {
    it('should return the correct label for each previous term', () => {
      const { previousTermsFormatted } = runCompute(
        trialSessionPlanningReportViewHelper,
        {
          state: {
            trialSessionPlanningReportData: {
              ...BASE_STATE,
              previousTerms: [
                { term: 'TEST_TERM_2', year: 2024 },
                { term: 'TEST_TERM_0', year: 2024 },
                { term: 'TEST_TERM_1', year: 2024 },
              ],
            },
          },
        } as any,
      );

      expect(previousTermsFormatted).toEqual([
        {
          term: 'TEST_TERM_2',
          termDisplayFormatted: 'Test_term_2 ‘24',
          year: 2024,
        },
        {
          term: 'TEST_TERM_0',
          termDisplayFormatted: 'Test_term_0 ‘24',
          year: 2024,
        },
        {
          term: 'TEST_TERM_1',
          termDisplayFormatted: 'Test_term_1 ‘24',
          year: 2024,
        },
      ]);
    });
  });

  describe('trialLocationDataFormatted', () => {
    it('should return the formatted trialLocationData correctly', () => {
      const { trialLocationDataFormatted } = runCompute(
        trialSessionPlanningReportViewHelper,
        {
          state: {
            trialSessionPlanningReportData: {
              ...BASE_STATE,
              trialLocationData: [
                {
                  lastVisitedDate: '2001-09-01T04:00:00.000Z',
                  previousTermsData: [[{}], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_1',
                },
                {
                  lastVisitedDate: '2004-09-01T04:00:00.000Z',
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_4',
                },
                {
                  previousTermsData: [[{}], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_3',
                },
                {
                  previousTermsData: [[], [], [{}]],
                  trialCityState: 'TEST_CITY_STATE_2',
                },
              ],
            },
          },
        } as any,
      );

      expect(trialLocationDataFormatted).toEqual([
        {
          hasNotBeenCalendared: false,
          lastVisitedDate: '2001-09-01T04:00:00.000Z',
          lastVisitedDateFormatted: 'Last visited week of 08/27/2001',
          previousTermsData: [[{}], [], [{}]],
          trialCityState: 'TEST_CITY_STATE_1',
        },
        {
          hasNotBeenCalendared: true,
          lastVisitedDate: '2004-09-01T04:00:00.000Z',
          lastVisitedDateFormatted: 'Last visited week of 08/30/2004',
          previousTermsData: [[], [], [{}]],
          trialCityState: 'TEST_CITY_STATE_4',
        },
        {
          hasNotBeenCalendared: false,
          lastVisitedDateFormatted: 'Never visited.',
          previousTermsData: [[{}], [], [{}]],
          trialCityState: 'TEST_CITY_STATE_3',
        },
        {
          hasNotBeenCalendared: true,
          lastVisitedDateFormatted: 'Never visited.',
          previousTermsData: [[], [], [{}]],
          trialCityState: 'TEST_CITY_STATE_2',
        },
      ]);
    });
  });

  describe('trialTerm', () => {
    it('should return trialTerm from state', () => {
      const TEST_TRIAL_TERM = 'TEST_TRIAL_TERM';
      const { trialTerm } = runCompute(trialSessionPlanningReportViewHelper, {
        state: {
          trialSessionPlanningReportData: {
            ...BASE_STATE,
            trialTerm: TEST_TRIAL_TERM,
          },
        },
      } as any);

      expect(trialTerm).toEqual(TEST_TRIAL_TERM);
    });
  });

  describe('trialYear', () => {
    it('should return trialYear from state', () => {
      const TEST_TRIAL_YEAR = 'TEST_TRIAL_YEAR';
      const { trialYear } = runCompute(trialSessionPlanningReportViewHelper, {
        state: {
          trialSessionPlanningReportData: {
            ...BASE_STATE,
            trialYear: TEST_TRIAL_YEAR,
          },
        },
      } as any);

      expect(trialYear).toEqual(TEST_TRIAL_YEAR);
    });
  });
});
