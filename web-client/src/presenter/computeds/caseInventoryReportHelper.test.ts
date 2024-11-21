import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
  DOCKET_NUMBER_SUFFIXES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseInventoryReportHelper as caseInventoryReportHelperComputed } from './caseInventoryReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseInventoryReportHelper', () => {
  const caseInventoryReportHelper = withAppContextDecorator(
    caseInventoryReportHelperComputed,
    { ...applicationContext },
  );

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
      CHIEF_JUDGE,
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
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
          status: CASE_STATUS_TYPES.new,
        },
      },
    });

    expect(result).toMatchObject({
      showJudgeColumn: false,
      showStatusColumn: false,
    });
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
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
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

  it('should show the no results message if a filter is selected but totalCount is 0', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
          totalCount: 0,
        },
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
          page: 1,
        },
      },
    });

    expect(result.showNoResultsMessage).toBeTruthy();
    expect(result.showSelectFilterMessage).toBeFalsy();
    expect(result.showResultsTable).toBeFalsy();
  });

  it('should show the select a filter message if a filter is not selected', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [],
        },
        screenMetadata: {},
      },
    });

    expect(result.showSelectFilterMessage).toBeTruthy();
    expect(result.showNoResultsMessage).toBeFalsy();
    expect(result.showResultsTable).toBeFalsy();
  });

  it('should show the results table if there are found cases', () => {
    const result = runCompute(caseInventoryReportHelper, {
      state: {
        caseInventoryReportData: {
          foundCases: [{ correspondence: [], docketNumber: '123-20' }],
        },
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
        },
      },
    });

    expect(result.showResultsTable).toBeTruthy();
    expect(result.showSelectFilterMessage).toBeFalsy();
    expect(result.showNoResultsMessage).toBeFalsy();
  });

  describe('caseStatuses', () => {
    it('should NOT include any of the "closed" statuses', () => {
      const result = runCompute(caseInventoryReportHelper, {
        state: {
          screenMetadata: {},
        },
      });

      expect(result.caseStatuses).toEqual(
        expect.not.arrayContaining(CLOSED_CASE_STATUSES),
      );
    });
  });
});
