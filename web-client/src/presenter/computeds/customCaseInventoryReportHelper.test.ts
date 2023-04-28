import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { CUSTOM_CASE_INVENTORY_PAGE_SIZE } from '../actions/CaseInventoryReport/getCustomCaseInventoryReportAction';
import { CustomCaseInventoryReportState } from '../customCaseInventoryReportState';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
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
    createdAt: '2018-03-01T21:40:46.415Z',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
  },
  {
    ...MOCK_CASE,
    associatedJudge: 'Judge Currozo',
    caseCaption: 'Test Petitioner 2',
    caseType: 'Deficiency',
    createdAt: '2022-03-01T21:40:46.415Z',
    docketNumber: '1338-20',
    preferredTrialCity: 'Birmingham, Alabama',
    procedureType: 'Regular',
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
        createEndDate: '2024-03-01T00:00:00.000Z',
        createStartDate: '2018-03-01T00:00:00.000Z',
        filingMethod: 'all',
      },
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
        createdAt: '03/01/18',
        docketNumber: '101-18',
        preferredTrialCity: 'Washington, District of Columbia',
        status: CASE_STATUS_TYPES.new,
      },
      {
        associatedJudge: 'Judge Currozo',
        caseType: 'Deficiency',
        createdAt: '03/01/22',
        docketNumber: '1338-20',
        preferredTrialCity: 'Birmingham, Alabama',
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

  it('should return true for runReportButtonIsDisabled if createEndDate or createStartDate are falsy', () => {
    defaultCustomCaseState.filters.createEndDate = 's';
    defaultCustomCaseState.filters.createStartDate = '';

    const result = runCompute(customCaseInventoryReportHelper, {
      state: { customCaseInventory: defaultCustomCaseState },
    });

    expect(result.runReportButtonIsDisabled).toEqual(true);
  });

  it('should return true for runReportButtonIsDisabled if createEndDate and createStartDate are both truthy', () => {
    defaultCustomCaseState.filters.createEndDate = 's';
    defaultCustomCaseState.filters.createStartDate = 's';
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
});
