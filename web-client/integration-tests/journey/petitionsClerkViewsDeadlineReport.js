import { CHIEF_JUDGE } from '../../../shared/src/business/entities/EntityConstants';
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

export const petitionsClerkViewsDeadlineReport = (test, options = {}) => {
  return it('Petitions clerk views deadline report', async () => {
    await test.runSequence('gotoCaseDeadlineReportSequence');
    expect(test.getState('currentPage')).toEqual('CaseDeadlines');
    expect(test.getState('judges').length).toBeGreaterThan(0);

    const computedStartDate = `01/${options.day}/${options.year}`;
    const computedEndDate = `02/${options.day}/${options.year}`;

    await test.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: prepareDateFromString(computedEndDate, FORMATS.MMDDYYYY),
      startDate: prepareDateFromString(computedStartDate, FORMATS.MMDDYYYY),
    });
    test.setState('screenMetadata.filterStartDateState', computedStartDate);
    test.setState('screenMetadata.filterEndDateState', computedEndDate);

    await test.runSequence('updateDateRangeForDeadlinesSequence');

    let deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(1); // the page size is overridden for integration tests to 1

    let helper = runCompute(caseDeadlineReportHelper, {
      state: test.getState(),
    });

    expect(helper.showLoadMoreButton).toBeTruthy();

    // 6 deadlines total, so click load more 5 times and then the load more button should be hidden
    await test.runSequence('loadMoreCaseDeadlinesSequence');
    await test.runSequence('loadMoreCaseDeadlinesSequence');
    await test.runSequence('loadMoreCaseDeadlinesSequence');
    await test.runSequence('loadMoreCaseDeadlinesSequence');
    await test.runSequence('loadMoreCaseDeadlinesSequence');

    deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(6);

    // verify sorting by date and docket number
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[0],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[1],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[2],
      },
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[0],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[1],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[2],
      },
    ]);

    helper = runCompute(caseDeadlineReportHelper, {
      state: test.getState(),
    });

    expect(helper.showLoadMoreButton).toBeFalsy();

    await test.runSequence('filterCaseDeadlinesByJudgeSequence', {
      judge: 'Buch',
    });

    deadlines = test.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(1);
    await test.runSequence('loadMoreCaseDeadlinesSequence');
    helper = runCompute(caseDeadlineReportHelper, {
      state: test.getState(),
    });

    expect(helper.showLoadMoreButton).toBeFalsy();

    // verify filtering by judge
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[0],
      },
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: test.createdDocketNumbers[0],
      },
    ]);
  });
};
