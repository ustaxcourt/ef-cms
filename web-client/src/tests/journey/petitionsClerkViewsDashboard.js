export default test => {
  return it('Petitions clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('cases').length).toBeGreaterThan(0);
  });
};
