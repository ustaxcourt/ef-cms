export const petitionsClerkAppliesSignatureToDraftDocument = cerebralTest => {
  return it('Petitions clerk applies signature to a draft document', async () => {
    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      isPdfAlreadySigned: false,
      signatureApplied: true,
      signatureData: { scale: 1, x: 20, y: 20 },
    });

    expect(cerebralTest.getState('pdfForSigning.signatureData')).toMatchObject({
      scale: 1,
      x: 20,
      y: 20,
    });
    expect(cerebralTest.getState('pdfForSigning.signatureApplied')).toEqual(
      true,
    );
    expect(cerebralTest.getState('pdfForSigning.isPdfAlreadySigned')).toEqual(
      false,
    );
  });
};
