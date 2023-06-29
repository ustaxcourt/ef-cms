export const docketClerkSignsUploadedCourtIssuedDocument = cerebralTest => {
  return it('Docket Clerk signs an uploaded court issued document', async () => {
    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');

    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await cerebralTest.runSequence('saveDocumentSigningSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDocument = cerebralTest
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === cerebralTest.docketEntryId);

    expect(caseDocument.signedAt).toBeTruthy();
  });
};
