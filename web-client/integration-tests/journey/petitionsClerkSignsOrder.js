export const petitionsClerkSignsOrder = cerebralTest => {
  return it('Petitions clerk signs order', async () => {
    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await cerebralTest.runSequence('saveDocumentSigningSequence');
  });
};
