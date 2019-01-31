export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual('individual');
    expect(test.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    await test.runSequence('switchWorkQueueSequence', {
      workQueueToDisplay: 'section',
    });
    expect(test.getState('workQueueToDisplay')).toEqual('section');
    expect(test.getState('sectionWorkQueue').length).toBeGreaterThan(0);
  });
};
