import {
  CASE_STATUS_TYPES,
  CUSTOM_CASE_REPORT_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import { CustomCaseReportState } from '../customCaseReportState';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { customCaseReportHelper as customCaseReportHelperComputed } from './customCaseReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const customCaseReportHelper = withAppContextDecorator(
  customCaseReportHelperComputed,
  applicationContext,
);

const cases: RawCase[] = [
  {
    ...MOCK_CASE,
    associatedJudge: 'Chief Judge',
    caseType: 'Passport',
    procedureType: 'Regular',
    receivedAt: '2018-03-01T21:40:46.415Z',
    status: CASE_STATUS_TYPES.new,
  },
  {
    ...MOCK_CASE,
    associatedJudge: 'Judge Currozo',
    caseCaption: 'Test Petitioner 2',
    caseType: 'Deficiency',
    docketNumber: '1338-20',
    preferredTrialCity: 'Birmingham, Alabama',
    procedureType: 'Regular',
    receivedAt: '2022-03-01T21:40:46.415Z',
    status: CASE_STATUS_TYPES.generalDocket,
  },
];

const mockJudges = [
  { name: 'Judge Judy', role: 'judge' },
  { name: 'Judge Mathis', role: 'judge' },
  { name: 'Judge Currozo', role: 'judge' },
];

describe('customCaseReportHelper', () => {
  let defaultCustomCaseState: CustomCaseReportState;
  let initialState;

  beforeEach(() => {
    defaultCustomCaseState = {
      cases: [],
      filters: {
        caseStatuses: [],
        caseTypes: [],
        endDate: '2024-03-01T00:00:00.000Z',
        filingMethod: 'all',
        judges: [],
        preferredTrialCities: [],
        procedureType: 'All',
        startDate: '2018-03-01T00:00:00.000Z',
      },
      totalCases: 0,
    };
    initialState = {
      customCaseReport: defaultCustomCaseState,
      judges: mockJudges,
    };
  });

  it('should generated generate cases with formatted dates', () => {
    defaultCustomCaseState.cases = cases;

    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.cases).toMatchObject([
      {
        associatedJudge: 'Chief Judge',
        caseType: 'Passport',
        docketNumber: '101-18',
        preferredTrialCity: 'Washington, District of Columbia',
        receivedAt: '03/01/18',
        status: CASE_STATUS_TYPES.new,
      },
      {
        associatedJudge: 'Judge Currozo',
        caseType: 'Deficiency',
        docketNumber: '1338-20',
        preferredTrialCity: 'Birmingham, Alabama',
        receivedAt: '03/01/22',
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ]);
  });

  it('should generate cases with caseCaption', () => {
    const foundCases = [
      { ...cases[0], caseCaption: 'Bugs Bunny, Petitioner' },
      { ...cases[1], caseCaption: 'Daffy Duck' },
    ];

    defaultCustomCaseState.cases = foundCases;

    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.cases).toMatchObject([
      {
        caseCaption: 'Bugs Bunny',
      },
      {
        caseCaption: 'Daffy Duck',
      },
    ]);
  });

  it('should return true for clearFiltersIsDisabled when no optional filters are selected', () => {
    defaultCustomCaseState.filters.caseTypes = [];
    defaultCustomCaseState.filters.caseStatuses = [];
    defaultCustomCaseState.filters.judges = [];
    defaultCustomCaseState.filters.preferredTrialCities = [];
    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.clearFiltersIsDisabled).toEqual(true);
  });

  it('should return false for clearFiltersIsDisabled when case status(es) or case type(s) are selected', () => {
    defaultCustomCaseState.filters.caseTypes = ['CDP (Lien/Levy)'];
    defaultCustomCaseState.filters.caseStatuses = [];
    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.clearFiltersIsDisabled).toEqual(false);
  });

  it('should return false for clearFiltersIsDisabled when judges or preferred trial city are selected', () => {
    defaultCustomCaseState.filters.judges = [];
    defaultCustomCaseState.filters.preferredTrialCities = ['Mobile, Alabama'];
    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.clearFiltersIsDisabled).toEqual(false);
  });

  it('should return the number of pages rounded up to the nearest whole number', () => {
    defaultCustomCaseState.totalCases = 305;

    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    const expectedPageCount = Math.ceil(305 / CUSTOM_CASE_REPORT_PAGE_SIZE);
    expect(result.pageCount).toEqual(expectedPageCount);
  });

  it('should set the maxDate to today', () => {
    const mockToday = '2022-04-13';
    applicationContext.getUtilities().formatNow.mockReturnValue(mockToday);

    const result = runCompute(customCaseReportHelper, {
      state: initialState,
    });

    expect(result.today).toEqual(mockToday);
  });

  describe('trialCitiesByState (DAW-10170 feature-flag gate)', () => {
    const NEW_CITIES = [
      'Austin, Texas',
      'Charlotte, North Carolina',
      'Newark, New Jersey',
      'Orlando, Florida',
      'Sacramento, California',
    ];

    const flattenCityValues = (result: {
      trialCitiesByState: { options: { value: string }[] }[];
    }): string[] =>
      result.trialCitiesByState.flatMap(group =>
        group.options.map(option => option.value),
      );

    it('should include the DAW-10170 trial cities when the "new-trial-cities-enabled" feature flag is on', () => {
      const result = runCompute(customCaseReportHelper, {
        state: {
          ...initialState,
          featureFlags: { 'new-trial-cities-enabled': true },
        },
      });

      expect(flattenCityValues(result)).toEqual(
        expect.arrayContaining(NEW_CITIES),
      );
    });

    it('should exclude the DAW-10170 trial cities when the "new-trial-cities-enabled" feature flag is off', () => {
      const result = runCompute(customCaseReportHelper, {
        state: {
          ...initialState,
          featureFlags: { 'new-trial-cities-enabled': false },
        },
      });

      expect(flattenCityValues(result)).not.toEqual(
        expect.arrayContaining(NEW_CITIES),
      );
    });
  });
});
