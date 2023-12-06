export const petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving = (
  cerebralTest,
  fakeFile,
) => {
  const applicationForWaiverOfFilingFeeFile =
    'applicationForWaiverOfFilingFeeFile';
  const documentToRemoveAndReAdd = 'stinFile';

  return it('Petitions Clerk uploads and removes pdf from petition without saving', async () => {
    cerebralTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await cerebralTest.runSequence('setDocumentForPreviewSequence');

    cerebralTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      'stinFile',
    );
    await cerebralTest.runSequence('setDocumentForPreviewSequence');

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: documentToRemoveAndReAdd,
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      cerebralTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(
      cerebralTest.getState('currentViewMetadata.documentSelectedForPreview'),
    ).toBe(documentToRemoveAndReAdd);

    await cerebralTest.runSequence('deleteUploadedPdfSequence');

    expect(cerebralTest.getState('pdfPreviewUrl')).toBeUndefined();
    expect(
      cerebralTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeUndefined();

    cerebralTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await cerebralTest.runSequence('setDocumentForPreviewSequence');
    expect(cerebralTest.getState('form.docketEntries')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'Application for Waiver of Filing Fee',
        }),
      ]),
    );

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
  });
};
