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

    expect(test.getState('allCaseDeadlines').length).toBeGreaterThan(0);

    if (test.caseDeadline) {
      expect(test.getState('allCaseDeadlines')[0].deadlineDate).toBe(
        '2025-08-12T04:00:00.000Z',
      );
    }
  });
};
