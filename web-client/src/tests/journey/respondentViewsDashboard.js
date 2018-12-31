export default test => {
  return it('Respondent views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardRespondent');
    expect(test.getState('cases').length).toBeGreaterThanOrEqual(0);
  });
};
