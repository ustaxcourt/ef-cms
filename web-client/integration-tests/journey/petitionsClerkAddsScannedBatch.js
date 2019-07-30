export default (test, { scannerSourceIndex, scannerSourceName }) => {
  return it('Petitions clerk adds a batch of scanned documents', async () => {
    await test.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    expect(Object.values(test.getState('batches'))).toHaveLength(1);
    expect(Object.keys(test.getState('batches'))).toEqual(['petitionFile']);
  });
};
