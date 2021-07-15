export const docketClerkNavigatesToEditDocketEntryMetaMinuteEntry = (
  cerebralTest,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(cerebralTest.getState('screenMetadata.editType')).toEqual(
      'NoDocument',
    );
  });
};
