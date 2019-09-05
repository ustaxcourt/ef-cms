export default test => {
  return it('Practitioner views dashboard before adding the case', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPractitioner');
  });
};
