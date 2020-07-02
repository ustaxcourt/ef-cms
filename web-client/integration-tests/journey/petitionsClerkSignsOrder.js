export const petitionsClerkSignsOrder = test => {
  return it('Petitions clerk signs order', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    await test.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await test.runSequence('saveDocumentSigningSequence');
  });
};
