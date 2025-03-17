import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseDeadlineReportHelper as caseDeadlineReportHelperComputed } from './caseDeadlineReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('caseDeadlineReportHelper', () => {
  const caseDeadlineReportHelper = withAppContextDecorator(
    caseDeadlineReportHelperComputed,
    { ...applicationContext },
  );

  const caseDeadlines = [
    {
      associatedJudge: 'Special Trial Judge Hale',
      deadlineDate: '2019-08-22T04:00:00.000Z',
      docketNumber: '101-19',
    },
    {
      associatedJudge: 'In Training Judge Brandeis',
      deadlineDate: '2019-08-24T04:00:00.000Z',
      docketNumber: '103-19',
    },
    {
      associatedJudge: 'Judge of Madea Rummy',
      deadlineDate: '2019-08-21T04:00:00.000Z',
      docketNumber: '101-19',
    },
    {
      associatedJudge: 'Not A Judge Barney',
      deadlineDate: '2019-08-21T04:00:00.000Z',
      docketNumber: '102-19',
    },
  ];

  it('should run without state', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: {},
      },
    });
    expect(result.formattedCaseDeadlines).toEqual([]);
    expect(result.formattedFilterDateHeader).toBeTruthy();
  });

  it('should use only the formatted startDate in header if start and end date are on the same day in ET', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlinesForCurrentPage: caseDeadlines },
        screenMetadata: {
          filterEndDate: '2019-08-21T12:59:59.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });
    expect(result.formattedFilterDateHeader).toEqual('August 21, 2019');
  });

  it('should return sorted and formatted judges with Chief Judge concatenated', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlinesForCurrentPage: caseDeadlines },
        judges: [{ name: 'Carluzzo' }, { name: 'Buch' }, { name: 'Dredd' }],
        screenMetadata: {
          filterEndDate: '2019-08-21T12:59:59.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });
    expect(result.judges).toEqual(['Buch', 'Carluzzo', 'Chief Judge', 'Dredd']);
  });

  it('should format the associated judge name to remove title so only the last name is returned', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlinesForCurrentPage: caseDeadlines },
        judges: [{ name: 'Carluzzo' }, { name: 'Buch' }, { name: 'Dredd' }],
        screenMetadata: {
          filterEndDate: '2019-08-21T12:59:59.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });

    expect(
      applicationContext.getUtilities().getJudgeLastName,
    ).toHaveBeenCalled();
    expect(result.formattedCaseDeadlines[0].associatedJudgeFormatted).toEqual(
      'Hale',
    );
    expect(result.formattedCaseDeadlines[1].associatedJudgeFormatted).toEqual(
      'Brandeis',
    );
    expect(result.formattedCaseDeadlines[2].associatedJudgeFormatted).toEqual(
      'Rummy',
    );
    expect(result.formattedCaseDeadlines[3].associatedJudgeFormatted).toEqual(
      'Barney',
    );
  });

  it('should format the caseDeadline with consolidated cases with correct icons and tool tips', () => {
    const consolidatedCaseDeadlines = [
      {
        associatedJudge: 'Judge of Madea Rummy',
        deadlineDate: '2019-08-21T04:00:00.000Z',
        docketNumber: '101-19',
        leadDocketNumber: '101-19',
      },
      {
        associatedJudge: 'Not A Judge Barney',
        deadlineDate: '2019-08-21T04:00:00.000Z',
        docketNumber: '102-19',
        leadDocketNumber: '101-19',
      },
      {
        associatedJudge: 'In Training Judge Brandeis',
        deadlineDate: '2019-08-24T04:00:00.000Z',
        docketNumber: '103-19',
      },
    ];
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: {
          caseDeadlinesForCurrentPage: consolidatedCaseDeadlines,
        },
        judges: [{ name: 'Carluzzo' }, { name: 'Buch' }],
        screenMetadata: {
          filterEndDate: '2019-08-21T12:59:59.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });

    expect(result.formattedCaseDeadlines[0].inConsolidatedGroup).toEqual(true);
    expect(result.formattedCaseDeadlines[0].inLeadCase).toEqual(true);
    expect(
      result.formattedCaseDeadlines[0].consolidatedIconTooltipText,
    ).toEqual('Lead case');
    expect(result.formattedCaseDeadlines[1].inConsolidatedGroup).toEqual(true);
    expect(result.formattedCaseDeadlines[1].inLeadCase).toEqual(false);
    expect(
      result.formattedCaseDeadlines[1].consolidatedIconTooltipText,
    ).toEqual('Consolidated case');
    expect(result.formattedCaseDeadlines[2].inConsolidatedGroup).toEqual(false);
    expect(result.formattedCaseDeadlines[2].inLeadCase).toEqual(false);
    expect(
      result.formattedCaseDeadlines[2].consolidatedIconTooltipText,
    ).toBeUndefined();
  });

  describe('showJudgeSelect', () => {
    it('should return showJudgeSelect true when caseDeadlines length is greater than 0', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: { caseDeadlinesForCurrentPage: caseDeadlines },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showJudgeSelect).toBeTruthy();
    });

    it('should return showJudgeSelect true when caseDeadlines length is 0 and judgeFilter is set', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: {
            caseDeadlines: [],
            judgeFilter: 'Carluzzo',
          },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showJudgeSelect).toBeTruthy();
    });

    it('should return showJudgeSelect false when caseDeadlines length is 0 and judgeFilter is not set', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: {
            caseDeadlinesForCurrentPage: [],
          },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showJudgeSelect).toBeFalsy();
    });
  });

  describe('showNoDeadlines', () => {
    it('should return showNoDeadlines true when caseDeadlines length is 0', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: {
            caseDeadlinesForCurrentPage: [],
          },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showNoDeadlines).toBeTruthy();
    });

    it('should return showNoDeadlines false when caseDeadlines length is greater than 0', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: { caseDeadlinesForCurrentPage: caseDeadlines },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showNoDeadlines).toBeFalsy();
    });
  });
});
