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
    let result = runCompute(caseDeadlineReportHelper, {
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
    let result = runCompute(caseDeadlineReportHelper, {
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

  it('should sort by date and docket number', () => {
    let result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlines },
        screenMetadata: {
          filterEndDate: '2019-08-23T04:00:00.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });
    expect(result.caseDeadlines).toMatchObject([
      {
        deadlineDate: '2019-08-21T04:00:00.000Z',
        docketNumber: '101-19',
      },
      {
        deadlineDate: '2019-08-21T04:00:00.000Z',
        docketNumber: '102-19',
      },
      {
        deadlineDate: '2019-08-22T04:00:00.000Z',
        docketNumber: '101-19',
      },
      {
        deadlineDate: '2019-08-24T04:00:00.000Z',
        docketNumber: '103-19',
      },
    ]);
    expect(result.formattedFilterDateHeader).toEqual(
      'August 21, 2019 – August 23, 2019',
    );
  });

  it('should filter deadlines by judge when a judge is selected', () => {
    const filteredCaseDeadlines = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlines },
        screenMetadata: {
          caseDeadlinesFilter: {
            judge: 'Rummy',
          },
          filterEndDate: '2019-08-23T04:00:00.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });

    expect(filteredCaseDeadlines.caseDeadlines).toMatchObject([
      {
        associatedJudge: 'Rummy',
        deadlineDate: '2019-08-21T04:00:00.000Z',
        docketNumber: '101-19',
      },
    ]);
  });

  it('should return showLoadMoreButton true when caseDeadlines length is less than totalCount', () => {
    let result = runCompute(caseDeadlineReportHelper, {
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
    let result = runCompute(caseDeadlineReportHelper, {
      state: {
        caseDeadlineReport: { caseDeadlines, totalCount: caseDeadlines.length },
        screenMetadata: {
          filterEndDate: '2019-08-23T04:00:00.000Z',
          filterStartDate: '2019-08-21T04:00:00.000Z',
        },
      },
    });
    expect(result.showLoadMoreButton).toBeFalsy();
  });
});
