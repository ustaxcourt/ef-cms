export const chambersUserSavesSignatureForDraftDocument = test => {
  return it('Chambers user saves signature for draft document', async () => {
    await test.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(test.getState('alertSuccess.message')).toEqual(
      'Order of Dismissal and Decision updated.',
    );
  });
};
