export default (test, docketRecordIndex = 1) => {
  return it('docket clerk verifies docket entry meta update', async () => {
    const caseDetail = test.getState('caseDetail');

    console.log('caseDetail.docketRecord', caseDetail.docketRecord);

    const docketRecordEntry = caseDetail.docketRecord.find(
      entry => entry.index === docketRecordIndex,
    );
    expect(docketRecordEntry.filedBy).toEqual('New Filer');
  });
};
