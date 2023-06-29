export const chambersUserSavesSignatureForDraftDocument = cerebralTest => {
  return it('Chambers user saves signature for draft document', async () => {
    await cerebralTest.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Order of Dismissal and Decision updated.',
    );
  });
};
