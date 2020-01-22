export default (test, docketRecordIndex = 1) => {
  return it('docket clerk verifies docket entry meta update', async () => {
    const caseDetail = test.getState('caseDetail');

    const docketRecordEntry = caseDetail.docketRecord.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.description).toEqual(
      'New Docket Entry Description',
    );

    expect(docketRecordEntry.filedBy).toEqual('New Filer');
  });
};
