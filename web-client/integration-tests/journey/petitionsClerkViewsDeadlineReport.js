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

    const allDeadlines = test.getState('allCaseDeadlines');

    const deadlinesForThisCase = allDeadlines.filter(
      d => d.docketNumber === test.docketNumber,
    );

    expect(deadlinesForThisCase.length).toEqual(2); //should be 1 when paging is all working

    expect(test.getState('allCaseDeadlines')[0].deadlineDate).toBe(
      '2025-08-12T04:00:00.000Z',
    );

    // show more button should show

    // click the show more button

    // length should now be 2

    // show more button should go away?
  });
};
