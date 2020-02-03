import { waitForRouter } from '../helpers';

export default (test, docketRecordIndex = 1) => {
  return it('docket clerk verifies docket entry meta update', async () => {
    await waitForRouter();

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const caseDetail = test.getState('caseDetail');
    const docketRecordEntry = caseDetail.docketRecord.find(
      entry => entry.index === docketRecordIndex,
    );

    expect(docketRecordEntry.filedBy).toEqual('New Filer');
  });
};
