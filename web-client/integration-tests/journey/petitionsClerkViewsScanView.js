export default test => {
  return it('verifies that the petition document tab is selected', async () => {
    await test.runSequence('navigateToPathSequence', {
      path: '/file-a-petition/step-1',
    });

    expect(test.getState('documentSelectedForScan')).toEqual('petitionFile');
  });
};
