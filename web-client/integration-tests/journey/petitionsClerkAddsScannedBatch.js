export const petitionsClerkAddsScannedBatch = (
  test,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Petitions clerk adds a batch of scanned documents', async () => {
    await test.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    expect(
      test.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(test.getState('scanner.batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
