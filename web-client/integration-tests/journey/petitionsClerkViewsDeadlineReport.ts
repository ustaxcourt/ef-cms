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

export const petitionsClerkViewsDeadlineReport = (
  cerebralTest,
  options = {},
) => {
  return it('Petitions clerk views deadline report', async () => {
    await cerebralTest.runSequence('gotoCaseDeadlineReportSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDeadlines');
    expect(cerebralTest.getState('judges').length).toBeGreaterThan(0);

    const computedStartDate = `01/${options.day}/${options.year}`;
    const computedEndDate = `02/${options.day}/${options.year}`;

    await cerebralTest.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: prepareDateFromString(computedEndDate, FORMATS.MMDDYYYY),
      startDate: prepareDateFromString(computedStartDate, FORMATS.MMDDYYYY),
    });
    cerebralTest.setState(
      'screenMetadata.filterStartDateState',
      computedStartDate,
    );
    cerebralTest.setState('screenMetadata.filterEndDateState', computedEndDate);

    await cerebralTest.runSequence('updateDateRangeForDeadlinesSequence');

    let deadlines = cerebralTest.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(1); // the page size is overridden for integration tests to 1

    let helper = runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showLoadMoreButton).toBeTruthy();

    // 6 deadlines total, so click load more 5 times and then the load more button should be hidden
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');

    deadlines = cerebralTest.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(6);

    // verify sorting by date and docket number
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[1],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[2],
      },
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[1],
      },
      {
        associatedJudge: CHIEF_JUDGE,
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[2],
      },
    ]);

    helper = runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showLoadMoreButton).toBeFalsy();

    await cerebralTest.runSequence('filterCaseDeadlinesByJudgeSequence', {
      judge: 'Buch',
    });

    deadlines = cerebralTest.getState('caseDeadlineReport.caseDeadlines');

    expect(deadlines.length).toEqual(1);
    await cerebralTest.runSequence('loadMoreCaseDeadlinesSequence');
    helper = runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.showLoadMoreButton).toBeFalsy();

    // verify filtering by judge
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
      {
        associatedJudge: 'Buch',
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
    ]);
  });
};
