export const docketClerkNavigatesToEditDocketEntryMetaForCourtIssued = (
  cerebralTest,
  docketRecordIndex = 1,
) => {
  it('the docketclerk navigates to page to edit docket entry meta for a court-issued document', async () => {
    await cerebralTest.runSequence('gotoEditDocketEntryMetaSequence', {
      docketNumber: cerebralTest.docketNumber,
      docketRecordIndex,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('EditDocketEntryMeta');
    expect(cerebralTest.getState('screenMetadata.editType')).toEqual(
      'CourtIssued',
    );
  });
};
