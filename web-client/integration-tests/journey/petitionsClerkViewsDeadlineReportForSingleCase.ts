import {
  FORMATS,
  prepareDateFromString,
} from '../../../shared/src/business/utilities/DateHandler';

export const petitionsClerkViewsDeadlineReportForSingleCase = (
  cerebralTest,
  overrides = {},
) => {
  return it('Petitions clerk views deadline report for a single case', async () => {
    await cerebralTest.runSequence('gotoCaseDeadlineReportSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDeadlines');
    expect(cerebralTest.getState('judges').length).toBeGreaterThan(0);

    let startDate, endDate;
    if (!overrides.day || !overrides.month || !overrides.year) {
      startDate = '01/01/2025';
      endDate = '12/01/2025';
    } else {
      const computedDate = `${overrides.month}/${overrides.day}/${overrides.year}`;
      startDate = computedDate;
      endDate = computedDate;
    }

    await cerebralTest.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: prepareDateFromString(endDate, FORMATS.MMDDYYYY),
      startDate: prepareDateFromString(startDate, FORMATS.MMDDYYYY),
    });
    cerebralTest.setState('screenMetadata.filterStartDateState', startDate);
    cerebralTest.setState('screenMetadata.filterEndDateState', endDate);

    await cerebralTest.runSequence('updateDateRangeForDeadlinesSequence');

    const deadlines = cerebralTest.getState('caseDeadlineReport.caseDeadlines');

    const deadlinesForThisCase = deadlines.filter(
      d => d.docketNumber === cerebralTest.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(2);
    expect(deadlinesForThisCase[0].deadlineDate).toBeDefined();
    expect(deadlinesForThisCase[1].deadlineDate).toBeDefined();
  });
};
