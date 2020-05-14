export const petitionsClerkDeletesMultipleScannedBatches = (
  test,
  { numBatches },
) => {
  return it('Petitions clerk deletes multiple batches', async () => {
    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = test.getState(`scanner.batches.${selectedDocumentType}`);

    expect(batches).toHaveLength(numBatches);

    for (let i = 0; i < numBatches; i++) {
      await test.runSequence('openConfirmDeleteBatchModalSequence', {
        batchIndexToDelete: 0,
      });

      await test.runSequence('removeBatchSequence');
    }

    expect(batches).toHaveLength(0);
  });
};
