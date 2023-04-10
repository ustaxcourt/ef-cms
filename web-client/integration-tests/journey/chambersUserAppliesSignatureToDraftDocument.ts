export const chambersUserAppliesSignatureToDraftDocument = (
  cerebralTest,
  expectedSignedJudgeName,
) => {
  return it('Chambers user applies signature to a draft document', async () => {
    expect(cerebralTest.getState('pdfForSigning.nameForSigning')).toEqual(
      expectedSignedJudgeName,
    );
    expect(cerebralTest.getState('pdfForSigning.nameForSigningLine2')).toEqual(
      'Judge',
    );

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
