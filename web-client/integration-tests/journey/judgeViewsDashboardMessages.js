export default test => {
  return it('Judge views dashboard messages', async () => {
    await test.runSequence('gotoDashboardSequence', {
      baseRoute: 'dashboard',
    });
    expect(test.getState('currentPage')).toEqual('DashboardJudge');
    expect(test.getState('workQueue').length).toBeGreaterThan(1);
    expect(test.getState('workQueue.0.messages.1.message')).toEqual(
      'karma karma karma karma karma chameleon',
    );
    expect(test.getState('workQueue.1.messages.1.message')).toEqual(
      "don't forget to be awesome",
    );
  });
};
