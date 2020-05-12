export const petitionsClerkClearsSignatureFromDraftDocument = test => {
  return it('petitions clerk clears signature on a draft document', async () => {
    await test.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      signatureApplied: false,
      signatureData: null,
    });

    expect(test.getState('pdfForSigning.signatureData')).toEqual(null);
    expect(test.getState('pdfForSigning.signatureApplied')).toEqual(false);
    expect(test.getState('pdfForSigning.isPdfAlreadySigned')).toEqual(false);
  });
};
