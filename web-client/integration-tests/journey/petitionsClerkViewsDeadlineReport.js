export const petitionsClerkViewsDeadlineReport = test => {
  return it('Petitions clerk views deadline report', async () => {
    await test.runSequence('gotoAllCaseDeadlinesSequence');
    expect(test.getState('currentPage')).toEqual('CaseDeadlines');
    expect(test.getState('allCaseDeadlines').length).toBeGreaterThan(0);
    expect(test.getState('judges').length).toBeGreaterThan(0);

    await test.runSequence('selectDateRangeFromCalendarSequence', {
      endDate: new Date('01/01/2025'),
      startDate: new Date('01/01/2025'),
    });

    expect(test.getState('allCaseDeadlines').length).toBeGreaterThan(0);

    if (test.caseDeadline) {
      expect(test.getState('allCaseDeadlines')[0].deadlineDate).toBe(
        test.caseDeadline,
      );
    }
  });
};
