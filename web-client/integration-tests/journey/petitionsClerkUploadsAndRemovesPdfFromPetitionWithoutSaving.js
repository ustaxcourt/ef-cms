export const petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving = (
  test,
  fakeFile,
) => {
  const applicationForWaiverOfFilingFeeFile =
    'applicationForWaiverOfFilingFeeFile';
  const documentToRemoveAndReAdd = 'stinFile';

  return it('Petitions Clerk uploads and removes pdf from petition without saving', async () => {
    test.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await test.runSequence('setDocumentForPreviewSequence');

    test.setState('currentViewMetadata.documentSelectedForPreview', 'stinFile');
    await test.runSequence('setDocumentForPreviewSequence');

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: documentToRemoveAndReAdd,
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form')[documentToRemoveAndReAdd]).toBeDefined();

    expect(test.getState('pdfPreviewUrl')).toBeDefined();
    expect(
      test.getState('currentViewMetadata.documentSelectedForPreview'),
    ).toBe(documentToRemoveAndReAdd);

    await test.runSequence('deleteUploadedPdfSequence');

    expect(test.getState('pdfPreviewUrl')).toBeUndefined();
    expect(test.getState('form')[documentToRemoveAndReAdd]).toBeUndefined();

    test.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await test.runSequence('setDocumentForPreviewSequence');
    expect(test.getState('form.docketEntries')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'Application for Waiver of Filing Fee',
        }),
      ]),
    );

    await test.runSequence('saveSavedCaseForLaterSequence');
  });
};
