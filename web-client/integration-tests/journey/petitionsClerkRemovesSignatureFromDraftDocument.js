export const petitionsClerkRemovesSignatureFromDraftDocument = test => {
  return it('Petitions clerk removes saved signature from draft document', async () => {
    await test.runSequence('openConfirmRemoveSignatureModalSequence', {
      docketEntryIdToEdit: test.docketEntryId,
    });

    await test.runSequence('removeSignatureSequence');

    expect(test.getState('alertSuccess.message')).toEqual('Signature removed.');
  });
};
