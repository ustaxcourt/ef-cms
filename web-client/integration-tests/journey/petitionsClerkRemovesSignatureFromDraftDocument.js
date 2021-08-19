export const petitionsClerkRemovesSignatureFromDraftDocument = cerebralTest => {
  return it('Petitions clerk removes saved signature from draft document', async () => {
    await cerebralTest.runSequence('openConfirmRemoveSignatureModalSequence', {
      docketEntryIdToEdit: cerebralTest.docketEntryId,
    });

    await cerebralTest.runSequence('removeSignatureSequence');

    expect(cerebralTest.getState('alertSuccess.message')).toEqual(
      'Signature removed.',
    );
  });
};
