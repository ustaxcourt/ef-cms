import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

export const petitionsClerkRemovesAndReaddsPdfFromPetition = (
  test,
  fakeFile,
) => {
  const documentToRemoveAndReAdd = 'applicationForWaiverOfFilingFeeFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds PDF from petition', async () => {
    test.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await test.runSequence('setDocumentForPreviewSequence');

    const documentIdToDelete = test.getState('documentId');
    expect(documentIdToDelete).toBeDefined();
    expect(test.getState('pdfPreviewUrl')).toBeDefined();

    await test.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = test
      .getState('form.documents')
      .find(doc => doc.documentId === documentIdToDelete);
    expect(deletedDocument).toBeUndefined();
    expect(test.getState('pdfPreviewUrl')).toBeUndefined();

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('validationErrors')).toEqual({
      applicationForWaiverOfFilingFeeFile:
        'Upload or scan an Application for Waiver of Filing Fee (APW)',
    });

    expect(test.getState('form.documents')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentType: 'Petition', eventCode: 'P' }),
      ]),
    );

    await test.runSequence('setDocumentForUploadSequence', {
      documentType: 'applicationForWaiverOfFilingFeeFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(test.getState('form')[documentToRemoveAndReAdd]).toBeDefined();

    await test.runSequence('saveSavedCaseForLaterSequence');
    expect(test.getState('validationErrors')).toEqual({});

    const newApwFileDocumentId = test
      .getState('caseDetail.documents')
      .find(
        doc =>
          doc.eventCode ===
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      );
    expect(newApwFileDocumentId).not.toBe(documentIdToDelete);
  });
};
