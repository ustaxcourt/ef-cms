export const petitionsClerkDeletesScannedBatch = test => {
  return it('Petitions clerk deletes a batch', async () => {
    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = test.getState(`scanner.batches.${selectedDocumentType}`);

    await test.runSequence('openConfirmDeleteBatchModalSequence', {
      batchIndexToDelete: 0,
    });

    await test.runSequence('removeBatchSequence');

    expect(batches).toHaveLength(0);
  });
};
