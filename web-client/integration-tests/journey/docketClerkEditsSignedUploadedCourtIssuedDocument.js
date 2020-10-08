export const docketClerkEditsSignedUploadedCourtIssuedDocument = (
  test,
  fakeFile,
) => {
  return it('Docket Clerk edits a signed uploaded court issued document', async () => {
    await test.runSequence('openConfirmEditModalSequence', {
      docketEntryIdToEdit: test.docketEntryId,
      docketNumber: test.docketNumber,
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
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === test.docketEntryId);
    expect(caseDocument.signedAt).toEqual(null);
  });
};
