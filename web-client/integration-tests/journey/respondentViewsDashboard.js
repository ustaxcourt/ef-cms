export const respondentViewsDashboard = test => {
  return it('Respondent views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardRespondent');
    expect(test.getState('openCases').length).toBeGreaterThanOrEqual(0);
  });
};
