export const docketClerkSignsOrder = (cerebralTest, draftOrderIndex) => {
  return it('Docket clerk signs order', async () => {
    const { docketEntryId } = cerebralTest.draftOrders[draftOrderIndex];

    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId,
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
