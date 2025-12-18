export const petitionsClerkRescansAddedBatch = cerebralTest => {
  return it('Petitions clerk rescans a pre-existing batch', async () => {
    const selectedDocumentType = cerebralTest.getState(
      'currentViewMetadata.documentSelectedForScan',
    );
    const batches = cerebralTest.getState(
      `scanner.batches.${selectedDocumentType}`,
    );
    const firstBatchIndex = batches[0]?.index;

    await cerebralTest.runSequence('openConfirmRescanBatchModalSequence', {
      batchIndexToRescan: firstBatchIndex,
    });

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmRescanBatchModal',
    );
    expect(cerebralTest.getState('scanner.batchIndexToRescan')).toEqual(
      firstBatchIndex,
    );

    await cerebralTest.runSequence('rescanBatchSequence', {
      scanMode: batches[0]?.scanMode,
    });

    expect(cerebralTest.getState('modal')).toEqual({});
    expect(
      cerebralTest.getState(`scanner.batches.${selectedDocumentType}`).length,
    ).toBeGreaterThan(0);
  });
};
