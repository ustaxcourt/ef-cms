export default test => {
  return it('Petitions clerk views My Document QC', async () => {
    await test.runSequence('navigateToPathSequence', {
      path: '/document-qc/my/inbox',
    });
    const workQueueToDisplay = test.getState('workQueueToDisplay');
    const workQueueIsInternal = test.getState('workQueueIsInternal');

    expect(workQueueIsInternal).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');
  });
};
