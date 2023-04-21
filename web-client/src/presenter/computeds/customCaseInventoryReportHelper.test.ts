import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
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
  it('should generated generate cases with formatted dates', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
        customCaseInventoryReportData: {
          foundCases: cases,
        },
      },
    });

    expect(result.customCaseInventoryReportData).toMatchObject([
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

    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
        customCaseInventoryReportData: {
          foundCases,
        },
      },
    });

    expect(result.customCaseInventoryReportData).toMatchObject([
      {
        caseTitle: 'Bugs Bunny',
      },
      {
        caseTitle: 'Daffy Duck',
      },
    ]);
  });

  it('should set noCustomCasesAfterReportRan to false if there are cases queried', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
        customCaseInventoryReportData: {
          foundCases: cases,
        },
      },
    });
    expect(result.noCustomCasesAfterReportRan).toEqual(false);
  });

  it('should set noCustomCasesAfterReportRan to true if there are no cases queried', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {},
        customCaseInventoryReportData: {
          foundCases: [],
        },
      },
    });
    expect(result.noCustomCasesAfterReportRan).toEqual(true);
  });

  it('should return false for isRunReportButtonDisabled if originalCreatedEndDate and originalCreatedStartDate are both falsy', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          originalCreatedEndDate: 's',
          originalCreatedStartDate: undefined,
        },
      },
    });

    expect(result.isRunReportButtonDisabled).toEqual(true);
  });

  it('should return true for isRunReportButtonDisabled if originalCreatedEndDate and originalCreatedStartDate are both truthy', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          originalCreatedEndDate: 'truthy',
          originalCreatedStartDate: 'truthy',
        },
      },
    });

    expect(result.isRunReportButtonDisabled).toEqual(false);
  });

  it('should return true for isClearFiltersDisabled when case status(es) or case type(s) selected are not selected', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          caseStatuses: [],
          caseTypes: [],
        },
      },
    });

    expect(result.isClearFiltersDisabled).toEqual(true);
  });

  it('should return false for isClearFiltersDisabled when case status(es) or case type(s) selected are selected', () => {
    const result = runCompute(customCaseInventoryReportHelper, {
      state: {
        customCaseInventoryFilters: {
          caseStatuses: ['Assigned - Case', 'Closed'],
          caseTypes: ['Deficiency'],
        },
      },
    });

    expect(result.isClearFiltersDisabled).toEqual(false);
  });
});
