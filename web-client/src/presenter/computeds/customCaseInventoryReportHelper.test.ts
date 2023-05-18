import {
  CASE_STATUS_TYPES,
  CUSTOM_CASE_INVENTORY_PAGE_SIZE,
} from '../../../../shared/src/business/entities/EntityConstants';
import { CustomCaseInventoryReportState } from '../customCaseInventoryReportState';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { customCaseInventoryReportHelper as customCaseInventoryReportHelperComputed } from './customCaseInventoryReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const customCaseInventoryReportHelper = withAppContextDecorator(
  customCaseInventoryReportHelperComputed,
  applicationContext,
);

const cases = [
  {
    ...MOCK_CASE,
    associatedJudge: 'Chief Judge',
    caseType: 'New',
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

describe('customCaseInventoryReportHelper', () => {
  let defaultCustomCaseState: CustomCaseInventoryReportState;
  beforeEach(() => {
    defaultCustomCaseState = {
      cases: [],
      filters: {
        caseStatuses: [],
        caseTypes: [],
        endDate: '2024-03-01T00:00:00.000Z',
        filingMethod: 'all',
        startDate: '2018-03-01T00:00:00.000Z',
      },
      lastIdsOfPages: [{ pk: '', receivedAt: 0 }],
      totalCases: 0,
    };
  });

  it('should generated generate cases with formatted dates', () => {
    defaultCustomCaseState.cases = cases;

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.cases).toMatchObject([
      {
        associatedJudge: 'Chief Judge',
        caseType: 'New',
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

  it('should generate cases with caseTitles', () => {
    const foundCases = [
      { ...cases[0], caseCaption: 'Bugs Bunny, Petitioner' },
      { ...cases[1], caseCaption: 'Daffy Duck' },
    ];

    defaultCustomCaseState.cases = foundCases;

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.cases).toMatchObject([
      {
        caseTitle: 'Bugs Bunny',
      },
      {
        caseTitle: 'Daffy Duck',
      },
    ]);
  });

  it('should return true for runReportButtonIsDisabled if endDate or startDate are falsy', () => {
    defaultCustomCaseState.filters.endDate = 's';
    defaultCustomCaseState.filters.startDate = '';

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.runReportButtonIsDisabled).toEqual(true);
  });

  it('should return true for runReportButtonIsDisabled if endDate and startDate are both truthy', () => {
    defaultCustomCaseState.filters.endDate = 's';
    defaultCustomCaseState.filters.startDate = 's';
    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.runReportButtonIsDisabled).toEqual(false);
  });

  it('should return true for clearFiltersIsDisabled when case status(es) or case type(s) selected are not selected', () => {
    defaultCustomCaseState.filters.caseTypes = [];
    defaultCustomCaseState.filters.caseStatuses = [];
    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.clearFiltersIsDisabled).toEqual(true);
  });

  it('should return false for clearFiltersIsDisabled when case status(es) or case type(s) selected are selected', () => {
    defaultCustomCaseState.filters.caseTypes = ['CDP (Lien/Levy)'];
    defaultCustomCaseState.filters.caseStatuses = [];
    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.clearFiltersIsDisabled).toEqual(false);
  });

  it('should return the number of pages rounded up to the nearest whole number', () => {
    defaultCustomCaseState.totalCases = 305;

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    const expectedPageCount = Math.ceil(305 / CUSTOM_CASE_INVENTORY_PAGE_SIZE);
    expect(result.pageCount).toEqual(expectedPageCount);
  });

  it('should set the maxDate to today', () => {
    const mockToday = '2022-04-13';
    applicationContext.getUtilities().formatNow.mockReturnValue(mockToday);

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.today).toEqual(mockToday);
  });
});
