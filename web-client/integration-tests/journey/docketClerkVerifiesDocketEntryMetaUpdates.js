export const docketClerkVerifiesDocketEntryMetaUpdates = (
  test,
  docketRecordIndex = 1,
) => {
  return it('docket clerk verifies docket entry meta update', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = test.getState('caseDetail');
    const docketRecordEntry = caseDetail.docketRecord.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.filingDate).toEqual('2020-01-04T05:00:00.000Z');
    expect(docketRecordEntry.filedBy).toEqual(
      'Resp. & Petr. Mona Schultz, Brianna Noble',
    );
    expect(docketRecordEntry.description).toEqual(
      'First Request for Admissions',
    );
  });
};
