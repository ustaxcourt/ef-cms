export const docketClerkSignsUploadedCourtIssuedDocument = test => {
  return it('Docket Clerk signs an uploaded court issued document', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    expect(test.getState('currentPage')).toEqual('SignOrder');

    await test.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await test.runSequence('saveDocumentSigningSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = test
      .getState('caseDetail.documents')
      .find(d => d.documentId === test.documentId);

    expect(caseDocument.signedAt).toBeTruthy();
  });
};
