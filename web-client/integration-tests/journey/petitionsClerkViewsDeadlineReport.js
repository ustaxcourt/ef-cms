import { caseDeadlineReportHelper } from '../../src/presenter/computeds/caseDeadlineReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsDeadlineReport = test => {
  return it('Petitions clerk views deadline report', async () => {
    await test.runSequence('gotoCaseDeadlineReportSequence');
    expect(test.getState('currentPage')).toEqual('CaseDeadlines');
    expect(test.getState('judges').length).toBeGreaterThan(0);

    await test.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: new Date('12/01/2025'),
      startDate: new Date('01/01/2025'),
    });
    test.setState('screenMetadata.filterStartDateState', '01/01/2025');
    test.setState('screenMetadata.filterEndDateState', '12/01/2025');

    await test.runSequence('updateDateRangeForDeadlinesSequence');

    let deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    let deadlinesForThisCase = deadlines.filter(
      d => d.docketNumber === test.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(1);

    expect(deadlinesForThisCase[0].deadlineDate).toBe(
      '2025-08-12T04:00:00.000Z',
    );

    const helper = runCompute(
      withAppContextDecorator(caseDeadlineReportHelper),
      {
        state: test.getState(),
      },
    );

    expect(helper.showLoadMoreButton).toBeTruthy();

    await test.runSequence('loadMoreCaseDeadlinesSequence');

    deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    deadlinesForThisCase = deadlines.filter(
      d => d.docketNumber === test.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(2);
  });
};
