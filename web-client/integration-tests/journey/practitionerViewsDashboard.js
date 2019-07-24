export default test => {
  return it('Practitioner views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPractitioner');
    expect(test.getState('cases').length).toBeGreaterThan(0);
    const latestDocketNumber = test.getState('cases.0.docketNumber');
    expect(test.docketNumber).toEqual(latestDocketNumber);
  });
};
