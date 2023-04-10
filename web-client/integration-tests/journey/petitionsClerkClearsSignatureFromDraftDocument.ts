export const petitionsClerkClearsSignatureFromDraftDocument = cerebralTest => {
  return it('petitions clerk clears signature on a draft document', async () => {
    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      signatureApplied: false,
      signatureData: null,
    });

    expect(cerebralTest.getState('pdfForSigning.signatureData')).toEqual(null);
    expect(cerebralTest.getState('pdfForSigning.signatureApplied')).toEqual(
      false,
    );
    expect(cerebralTest.getState('pdfForSigning.isPdfAlreadySigned')).toEqual(
      false,
    );
  });
};
