export default test => {
  return it('Petitions clerk starts the batch process', async () => {
    await test.runSequence('runBatchProcessSequence');
  });
};
