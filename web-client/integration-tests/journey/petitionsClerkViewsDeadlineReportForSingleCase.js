import {
  FORMATS,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';
import { caseDeadlineReportHelper as caseDeadlineReportHelperComputed } from '../../src/presenter/computeds/caseDeadlineReportHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseDeadlineReportHelper = withAppContextDecorator(
  caseDeadlineReportHelperComputed,
);

export const petitionsClerkViewsDeadlineReportForSingleCase = (
  test,
  overrides = {},
) => {
  return it('Petitions clerk views deadline report for a single case', async () => {
    await test.runSequence('gotoCaseDeadlineReportSequence');
    expect(test.getState('currentPage')).toEqual('CaseDeadlines');
    expect(test.getState('judges').length).toBeGreaterThan(0);

    let startDate, endDate;
    if (!overrides.day || !overrides.month || !overrides.year) {
      startDate = '01/01/2025';
      endDate = '12/01/2025';
    } else {
      const computedDate = `${overrides.month}/${overrides.day}/${overrides.year}`;
      startDate = computedDate;
      endDate = computedDate;
    }

    await test.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: prepareDateFromString(endDate, FORMATS.MMDDYYYY),
      startDate: prepareDateFromString(startDate, FORMATS.MMDDYYYY),
    });
    test.setState('screenMetadata.filterStartDateState', startDate);
    test.setState('screenMetadata.filterEndDateState', endDate);

    await test.runSequence('updateDateRangeForDeadlinesSequence');

    let deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    let deadlinesForThisCase = deadlines.filter(
      d => d.docketNumber === test.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(1);

    expect(deadlinesForThisCase[0].deadlineDate).toBeDefined();

    let helper = runCompute(caseDeadlineReportHelper, {
      state: test.getState(),
    });

    expect(helper.showLoadMoreButton).toBeTruthy();

    await test.runSequence('loadMoreCaseDeadlinesSequence');

    deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    deadlinesForThisCase = deadlines.filter(
      d => d.docketNumber === test.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(2);

    helper = runCompute(caseDeadlineReportHelper, {
      state: test.getState(),
    });

    expect(helper.showLoadMoreButton).toBeFalsy();
  });
};
