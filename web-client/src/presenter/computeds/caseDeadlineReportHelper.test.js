import { caseDeadlineReportHelper as caseDeadlineReportHelperComputed } from './caseDeadlineReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseDeadlineReportHelper = withAppContextDecorator(
  caseDeadlineReportHelperComputed,
);

const caseDeadlines = [
  {
    associatedJudge: 'Hale',
    deadlineDate: '2019-08-22T04:00:00.000Z',
    docketNumber: '101-19',
  },
  {
    associatedJudge: 'Brandeis',
    deadlineDate: '2019-08-24T04:00:00.000Z',
    docketNumber: '103-19',
  },
  {
    associatedJudge: 'Rummy',
    deadlineDate: '2019-08-21T04:00:00.000Z',
    docketNumber: '101-19',
  },
  {
    associatedJudge: 'Renjie',
    deadlineDate: '2019-08-21T04:00:00.000Z',
    docketNumber: '102-19',
  },
];

describe('caseDeadlineReportHelper', () => {
  it('should run without state', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: {},
      },
    });
    expect(result.totalCount).toEqual(0);
    expect(result.caseDeadlines).toEqual([]);
    expect(result.formattedFilterDateHeader).toBeTruthy();
    expect(result.showLoadMoreButton).toBeFalsy();
  });

  it('should use only the formatted startDate in header if start and end date are on the same day', () => {
    const result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlines },
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
        caseDeadlineReport: { caseDeadlines },
        judges: [{ name: 'Carluzzo' }, { name: 'Buch' }, { name: 'Dredd' }],
        screenMetadata: {
          filterEndDate: '2019-08-21T12:59:59.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });
    expect(result.judges).toEqual(['Buch', 'Carluzzo', 'Chief Judge', 'Dredd']);
  });

  describe('showLoadMoreButton', () => {
    it('should return showLoadMoreButton true when caseDeadlines length is less than totalCount', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: { caseDeadlines, totalCount: 20 },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showLoadMoreButton).toBeTruthy();
    });

    it('should return showLoadMoreButton false when caseDeadlines length is equal to totalCount', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: {
            caseDeadlines,
            totalCount: caseDeadlines.length,
          },
          screenMetadata: {
            filterEndDate: '2019-08-23T04:00:00.000Z',
            filterStartDate: '2019-08-21T04:00:00.000Z',
          },
        },
      });
      expect(result.showLoadMoreButton).toBeFalsy();
    });
  });

  describe('showJudgeSelect', () => {
    it('should return showJudgeSelect true when caseDeadlines length is greater than 0', () => {
      const result = runCompute(caseDeadlineReportHelper, {
        state: {
          caseDeadlineReport: { caseDeadlines, totalCount: 20 },
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
            totalCount: 0,
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
            caseDeadlines: [],
            totalCount: 0,
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
            caseDeadlines: [],
            totalCount: 0,
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
          caseDeadlineReport: { caseDeadlines, totalCount: 20 },
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
