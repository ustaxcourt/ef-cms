export default test => {
  return it('petitioner views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(test.getState('cases').length).toBeGreaterThan(0);
    test.docketNumber = test.getState('cases.0.docketNumber');
  });
};
