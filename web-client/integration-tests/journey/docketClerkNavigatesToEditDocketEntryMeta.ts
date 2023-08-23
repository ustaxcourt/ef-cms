export const docketClerkNavigatesToEditDocketEntryMeta = (
  cerebralTest,
  docketRecordIndex = 1,
) => {
  it('the docketclerk navigates to page to edit docket entry meta', async () => {
    console.log('docketRecordIndex FOR NAVIGATION', docketRecordIndex);

    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(cerebralTest.getState('screenMetadata.editType')).toEqual(
      'Document',
    );
  });
};
