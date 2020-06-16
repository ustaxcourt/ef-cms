export const petitionsClerkRescansAddedBatch = test => {
  return it('Petitions clerk rescans a pre-existing batch', async () => {
    const selectedDocumentType = test.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    await test.runSequence('openConfirmRescanBatchModalSequence', {
      batchIndexToRescan: 0,
    });

    expect(test.getState('modal.showModal')).toEqual('ConfirmRescanBatchModal');
    expect(test.getState('scanner.batchIndexToRescan')).toEqual(0);

    await test.runSequence('rescanBatchSequence');

    expect(test.getState('modal')).toEqual({});
    expect(
      test.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
  });
};
