export const docketClerkEditsSignedUploadedCourtIssuedDocument = (
  cerebralTest,
  fakeFile,
) => {
  return it('Docket Clerk edits a signed uploaded court issued document', async () => {
    await cerebralTest.runSequence('openConfirmEditModalSequence', {
      docketEntryIdToEdit: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('navigateToEditOrderSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditUploadCourtIssuedDocument',
    );

    await cerebralTest.runSequence('clearExistingDocumentSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('editUploadCourtIssuedDocumentSequence', {
      tab: 'drafts',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === cerebralTest.docketEntryId);
    expect(caseDocument.signedAt).toEqual(null);
  });
};
