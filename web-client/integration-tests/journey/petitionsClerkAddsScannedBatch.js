export const petitionsClerkAddsScannedBatch = (
  cerebralTest,
  { scannerSourceIndex, scannerSourceName },
) => {
  return it('Petitions clerk adds a batch of scanned documents', async () => {
    await cerebralTest.runSequence('startScanSequence', {
      scannerSourceIndex,
      scannerSourceName,
    });

    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    expect(
      cerebralTest.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(cerebralTest.getState('scanner.batches'))).toEqual([
      selectedDocumentType,
    ]);
  });
};
