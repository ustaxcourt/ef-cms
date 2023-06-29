export const petitionsClerkRescansAddedBatch = cerebralTest => {
  return it('Petitions clerk rescans a pre-existing batch', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );

    await cerebralTest.runSequence('openConfirmRescanBatchModalSequence', {
      batchIndexToRescan: 0,
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmRescanBatchModal',
    );
    expect(cerebralTest.getState('scanner.batchIndexToRescan')).toEqual(0);

    await cerebralTest.runSequence('rescanBatchSequence');

    expect(cerebralTest.getState('modal')).toEqual({});
    expect(
      cerebralTest.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
  });
};
