import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

export const petitionsClerkRemovesAndReaddsPdfFromPetition = (
  cerebralTest,
  fakeFile,
) => {
  const documentToRemoveAndReAdd = 'applicationForWaiverOfFilingFeeFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds PDF from petition', async () => {
    cerebralTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await cerebralTest.runSequence('setDocumentForPreviewSequence');

    const docketEntryIdToDelete = cerebralTest.getState('docketEntryId');
    expect(docketEntryIdToDelete).toBeDefined();
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    await cerebralTest.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = cerebralTest
      .getState('form.docketEntries')
      .find(doc => doc.docketEntryId === docketEntryIdToDelete);
    expect(deletedDocument).toBeUndefined();
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeUndefined();

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      applicationForWaiverOfFilingFeeFile:
        'Upload or scan an Application for Waiver of Filing Fee (APW)',
    });

    expect(cerebralTest.getState('form.docketEntries')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentType: 'Petition', eventCode: 'P' }),
      ]),
    );

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'applicationForWaiverOfFilingFeeFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      cerebralTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});

    const newApwFileDocketEntryId = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(
        doc =>
          doc.eventCode ===
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      );
    expect(newApwFileDocketEntryId).not.toBe(docketEntryIdToDelete);
  });
};
