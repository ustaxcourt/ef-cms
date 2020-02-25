export default test => {
  return it('Chambers user saves signature for draft document', async () => {
    await test.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(test.getState('alertSuccess.message')).toEqual(
      'Your signature has been added',
    );
  });
};
