export const petitionsClerkDeletesScannedBatch = cerebralTest => {
  return it('Petitions clerk deletes a batch', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = cerebralTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );

    await cerebralTest.runSequence('openConfirmDeleteBatchModalSequence', {
      batchIndexToDelete: 0,
    });

    await cerebralTest.runSequence('removeBatchSequence');

    expect(batches).toHaveLength(0);
  });
};
