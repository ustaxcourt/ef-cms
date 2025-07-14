import { CHIEF_JUDGE } from '../../../shared/src/business/entities/EntityConstants';
import {
  FORMATS,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';
import { caseDeadlineReportHelper as caseDeadlineReportHelperComputed } from '../../src/presenter/computeds/caseDeadlineReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsDeadlineReport = (
  cerebralTest,
  options = {
    day: undefined,
    year: undefined,
  },
) => {
  const caseDeadlineReportHelper = withAppContextDecorator(
    caseDeadlineReportHelperComputed,
  );

  return it('Petitions clerk views deadline report', async () => {
    await cerebralTest.runSequence('gotoCaseDeadlineReportSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDeadlines');
    expect(cerebralTest.getState('judges').length).toBeGreaterThan(0);

    const computedStartDate = `01/${options.day}/${options.year}`;
    const computedEndDate = `02/${options.day}/${options.year}`;
    const buchUserId = cerebralTest
      .getState('judges')
      .find(judge => judge.name === 'Buch').userId;

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

    let deadlines = cerebralTest.getState(
      'caseDeadlineReport.caseDeadlinesForCurrentPage',
    );

    expect(deadlines.length).toEqual(6);

    runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    deadlines = cerebralTest.getState(
      'caseDeadlineReport.caseDeadlinesForCurrentPage',
    );

    expect(deadlines.length).toEqual(6);

    // verify sorting by date and docket number
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        associatedJudgeId: buchUserId,
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
        associatedJudgeId: buchUserId,
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

    runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    await cerebralTest.runSequence('filterCaseDeadlinesByJudgeSequence', {
      selectedJudgeId: buchUserId,
    });
    
    await cerebralTest.runSequence('updateDateRangeForDeadlinesSequence');

    deadlines = cerebralTest.getState(
      'caseDeadlineReport.caseDeadlinesForCurrentPage',
    );

    expect(deadlines.length).toEqual(2);

    runCompute(caseDeadlineReportHelper, {
      state: cerebralTest.getState(),
    });

    // verify filtering by judge
    expect(deadlines).toMatchObject([
      {
        associatedJudge: 'Buch',
        associatedJudgeId: buchUserId,
        deadlineDate: `${options.year}-01-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
      {
        associatedJudge: 'Buch',
        associatedJudgeId: buchUserId,
        deadlineDate: `${options.year}-02-${options.day}T05:00:00.000Z`,
        docketNumber: cerebralTest.createdDocketNumbers[0],
      },
    ]);
  });
};
