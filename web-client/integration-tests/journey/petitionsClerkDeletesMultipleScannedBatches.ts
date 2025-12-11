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
      const currentBatches = cerebralTest.getState(
        `scanner.batches.${selectedDocumentType}`,
      );
      const firstBatchIndex = currentBatches[0]?.index;

      await cerebralTest.runSequence('openConfirmDeleteBatchModalSequence', {
        batchIndexToDelete: firstBatchIndex,
      });

      await cerebralTest.runSequence('removeBatchSequence');
    }

    const finalBatches = cerebralTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );
    expect(finalBatches).toHaveLength(0);
  });
};
