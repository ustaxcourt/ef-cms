export const docketClerkNavigatesToEditDocketEntryMetaForCourtIssued = (
  test,
  docketRecordIndex = 1,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a court-issued document', async () => {
    await test.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: test.docketNumber,
      docketRecordIndex,
    });

    expect(test.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(test.getState('screenMetadata.editType')).toEqual('CourtIssued');
  });
};
