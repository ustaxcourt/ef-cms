export default test => {
  return it('Petitions clerk views Section Document QC', async () => {
    await test.runSequence('navigateToPathSequence', {
      path: '/document-qc/section/inbox',
    });
    const workQueueToDisplay = test.getState('workQueueToDisplay');
    const workQueueIsInternal = test.getState('workQueueIsInternal');

    expect(workQueueIsInternal).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');
  });
};
