export const petitionsClerkViewsDocketRecordAfterServing = test => {
  return it('Petitions clerk views docket record after serving petition on the IRS', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('caseDetail.docketEntries')).toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2018-12-24T05:00:00.000Z',
      index: 6,
    });
  });
};
