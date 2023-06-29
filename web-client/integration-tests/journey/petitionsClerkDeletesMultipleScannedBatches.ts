export const petitionsClerkDeletesMultipleScannedBatches = (
  cerebralTest,
  { numBatches },
) => {
  return it('Petitions clerk deletes multiple batches', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = cerebralTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );

    expect(batches).toHaveLength(numBatches);

    for (let i = 0; i < numBatches; i++) {
      await cerebralTest.runSequence('openConfirmDeleteBatchModalSequence', {
        batchIndexToDelete: 0,
      });

      await cerebralTest.runSequence('removeBatchSequence');
    }

    expect(batches).toHaveLength(0);
  });
};
