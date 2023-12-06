export const petitionsClerkSavesSignatureForDraftDocument = (
  cerebralTest,
  title,
) => {
  return it('Petitions clerk saves signature for draft document', async () => {
    await cerebralTest.runSequence('saveDocumentSigningSequence', {
      gotoAfterSigning: 'DocumentDetail',
    });

    expect(cerebralTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      cerebralTest.docketEntryId,
    );
    expect(cerebralTest.getState('alertSuccess.message')).toEqual(title);
  });
};
