export const petitionsClerkAppliesSignatureToDraftDocument = test => {
  return it('Petitions clerk applies signature to a draft document', async () => {
    await test.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      signatureApplied: true,
      signatureData: { scale: 1, x: 20, y: 20 },
    });

    expect(test.getState('pdfForSigning.signatureData')).toMatchObject({
      scale: 1,
      x: 20,
      y: 20,
    });
    expect(test.getState('pdfForSigning.signatureApplied')).toEqual(true);
    expect(test.getState('pdfForSigning.isPdfAlreadySigned')).toEqual(false);
  });
};
