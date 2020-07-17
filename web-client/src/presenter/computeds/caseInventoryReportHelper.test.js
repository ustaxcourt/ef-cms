import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { caseInventoryReportHelper as caseInventoryReportHelperComputed } from './caseInventoryReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

applicationContext.getCurrentUser = () => ({
  role: ROLES.docketClerk,
  userId: '5d66d122-8417-427b-9048-c1ba8ab1ea68',
});

const testCaseInventoryPageSize = 25;

const constants = {
  ...applicationContext.getConstants(),
  CASE_INVENTORY_PAGE_SIZE: testCaseInventoryPageSize,
};
const caseInventoryReportHelper = withAppContextDecorator(
  caseInventoryReportHelperComputed,
  {
    ...applicationContext,
    getConstants: () => constants,
  },
);

describe('caseInventoryReportHelper', () => {
  it('should return all case statuses', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        screenMetadata: {},
      },
    });

    expect(result.caseStatuses).toEqual(Object.values(CASE_STATUS_TYPES));
  });

  it('should return all judges from state along with Chief Judge sorted alphabetically', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        judges: [
          { name: 'Joseph Dredd' },
          { name: 'Judith Blum' },
          { name: 'Roy Scream' },
        ],
        screenMetadata: {},
      },
    });

    expect(result.judges).toEqual([
      'Chief Judge',
      'Joseph Dredd',
      'Judith Blum',
      'Roy Scream',
    ]);
  });

  it('should return showJudgeColumn and showStatusColumn true if associatedJudge and status are not set on screenMetadata', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        screenMetadata: {},
      },
    });

    expect(result).toMatchObject({
      showJudgeColumn: true,
      showStatusColumn: true,
    });
  });

  it('should return showJudgeColumn and showStatusColumn false if associatedJudge and status are set on screenMetadata', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        screenMetadata: { associatedJudge: 'Chief Judge', status: 'New' },
      },
    });

    expect(result).toMatchObject({
      showJudgeColumn: false,
      showStatusColumn: false,
    });
  });

  it('should return a result count from caseInventoryReportData', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          totalCount: '1',
        },
        screenMetadata: {},
      },
    });

    expect(result.resultCount).toEqual('1');
    expect(result.formattedReportData).toEqual([]);
  });

  it('should sort and format cases from caseInventoryReportData.foundCases', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [
            {
              correspondence: [],
              docketNumber: '123-20',
              docketNumberWithSuffix: '123-20',
            },
            {
              correspondence: [],
              docketNumber: '123-19',
              docketNumberSuffix: 'L',
              docketNumberWithSuffix: '123-19L',
            },
            {
              correspondence: [],
              docketNumber: '135-19',
              docketNumberWithSuffix: '135-19',
            },
          ],
        },
        screenMetadata: {},
      },
    });

    expect(result.formattedReportData).toMatchObject([
      {
        docketNumberWithSuffix: '123-19L',
      },
      {
        docketNumberWithSuffix: '135-19',
      },
      {
        docketNumberWithSuffix: '123-20',
      },
    ]);
  });

  it('should return the nextPageSize as a calculation of the number of results on the next page', () => {
    let result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: testCaseInventoryPageSize * 3, // three pages of data
        },
        screenMetadata: {
          page: 1, // the next page should be a full testCaseInventoryPageSize set of results
        },
      },
    });

    expect(result.nextPageSize).toEqual(testCaseInventoryPageSize);

    result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: testCaseInventoryPageSize + 1, // 1 more than a full page means a second page with 1 result
        },
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.nextPageSize).toEqual(1);

    const lastFullPage = 3;
    const totalCount = testCaseInventoryPageSize * lastFullPage + 1; // we want to see 1 result on the last page

    result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount,
        },
        screenMetadata: {
          page: lastFullPage + 1, // Last page of results (where there should be only one result)
        },
      },
    });

    expect(result.nextPageSize).toEqual(0);
  });

  it('should show the load more button when there are more results to load', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: 200,
        },
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.showLoadMoreButton).toBeTruthy();
  });

  it('should NOT show the load more button when there are NO MORE results to load', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: testCaseInventoryPageSize,
        },
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.showLoadMoreButton).toBeFalsy();
  });

  it('should show the no results message if a filter is selected but totalCount is 0', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: 0,
        },
        screenMetadata: {
          associatedJudge: 'Chief Judge',
          page: 1,
        },
      },
    });

    expect(result.showNoResultsMessage).toBeTruthy();
    expect(result.showSelectFilterMessage).toBeFalsy();
    expect(result.showResultsTable).toBeFalsy();
  });

  it('should show the select a filter message if totalCount is 0 and a filter is not selected', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: 0,
        },
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.showSelectFilterMessage).toBeTruthy();
    expect(result.showNoResultsMessage).toBeFalsy();
    expect(result.showResultsTable).toBeFalsy();
  });

  it('should show the results table if totalCount is not 0', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [{ correspondence: [], docketNumber: '123-20' }],
          totalCount: 1,
        },
        screenMetadata: {
          page: 1,
        },
      },
    });

    expect(result.showResultsTable).toBeTruthy();
    expect(result.showSelectFilterMessage).toBeFalsy();
    expect(result.showNoResultsMessage).toBeFalsy();
  });
});
