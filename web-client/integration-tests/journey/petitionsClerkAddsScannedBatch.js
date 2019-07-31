export default (test, { scannerSourceIndex, scannerSourceName }) => {
  return it('Petitions clerk adds a batch of scanned documents', async () => {
    await test.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = test.getState('documentSelectedForScan');

    expect(
      test.getState(`batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(test.getState('batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
