export const docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry = (
  test,
  docketRecordIndex = 2,
) => {
  return it('docket clerk verifies docket entry meta updates for a minute entry', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = test.getState('caseDetail');
    const docketRecordEntry = caseDetail.docketEntries.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.filingDate).toEqual('2020-01-04T05:00:00.000Z');
    expect(docketRecordEntry.documentTitle).toEqual(
      'Request for Place of Trial at Boise, Idaho',
    );
  });
};
