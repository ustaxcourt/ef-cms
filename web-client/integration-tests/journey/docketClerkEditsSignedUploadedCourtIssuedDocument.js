export const docketClerkEditsSignedUploadedCourtIssuedDocument = (
  test,
  fakeFile,
) => {
  return it('Docket Clerk edits a signed uploaded court issued document', async () => {
    await test.runSequence('openConfirmEditModalSequence', {
      docketNumber: test.docketNumber,
      documentIdToEdit: test.documentId,
    });

    await test.runSequence('navigateToEditOrderSequence');

    expect(test.getState('currentPage')).toEqual(
      'EditUploadCourtIssuedDocument',
    );

    await test.runSequence('clearExistingDocumentSequence');

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('editUploadCourtIssuedDocumentSequence', {
      tab: 'drafts',
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = test
      .getState('caseDetail.documents')
      .find(d => d.documentId === test.documentId);
    expect(caseDocument.signedAt).toEqual(null);
  });
};
