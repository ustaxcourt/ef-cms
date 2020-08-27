export const docketClerkVerifiesDocketEntryMetaCourtIssuedUpdates = (
  test,
  docketRecordIndex = 1,
) => {
  return it('docket clerk verifies docket entry meta update for court-issued doc', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = test.getState('caseDetail');
    console.log('documents', caseDetail.documents);
    console.log('docketRecordIndex', docketRecordIndex);
    const docketRecordEntry = caseDetail.documents.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.description).toEqual(
      'Order for Amended Petition on 04-04-2050 be free',
    );
  });
};
