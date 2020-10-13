export const chambersUserAppliesSignatureToDraftDocument = test => {
  return it('Chambers user applies signature to a draft document', async () => {
    expect(test.getState('pdfForSigning.nameForSigning')).toEqual(
      'John O. Colvin',
    );
    expect(test.getState('pdfForSigning.nameForSigningLine2')).toEqual('Judge');

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
