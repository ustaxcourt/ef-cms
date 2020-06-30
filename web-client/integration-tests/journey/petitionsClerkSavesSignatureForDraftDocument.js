export const petitionsClerkSavesSignatureForDraftDocument = (test, title) => {
  return it('Petitions clerk saves signature for draft document', async () => {
    await test.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(test.getState('alertSuccess.message')).toEqual(title);
  });
};
