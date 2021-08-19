export const respondentViewsDashboard = cerebralTest => {
  return it('Respondent views dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardRespondent');
    expect(cerebralTest.getState('openCases').length).toBeGreaterThanOrEqual(0);
  });
};
