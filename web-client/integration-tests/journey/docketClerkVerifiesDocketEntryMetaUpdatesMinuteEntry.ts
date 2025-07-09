export const docketClerkVerifiesDocketEntryMetaUpdatesMinuteEntry = (
  cerebralTest,
  docketRecordIndex = 2,
) => {
  return it('docket clerk verifies docket entry meta updates for a minute entry', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = cerebralTest.getState('caseDetail');
    const docketRecordEntry = caseDetail.docketEntries.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.filingDate).toEqual('2020-01-04T05:00:00.000Z');
    expect(docketRecordEntry.documentTitle).toEqual(
      'Request for Place of Trial at Boise, Idaho',
    );
  });
};
