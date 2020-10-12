export const docketClerkNavigatesToEditDocketEntryMetaMinuteEntry = (
  test,
  docketRecordIndex = 2,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a minute entry', async () => {
    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(test.getState('screenMetadata.editType')).toEqual('NoDocument');
  });
};
