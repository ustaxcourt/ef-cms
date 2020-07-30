export const docketClerkRemovesSignatureFromUploadedCourtIssuedDocument = test => {
  return it('Docket Clerk removes signature from an uploaded court issued document', async () => {
    await test.runSequence('openConfirmRemoveSignatureModalSequence', {
      documentIdToEdit: test.documentId,
    });

    await test.runSequence('removeSignatureSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = test
      .getState('caseDetail.documents')
      .find(d => d.documentId === test.documentId);

    expect(caseDocument.signedAt).toEqual(null);
  });
};
