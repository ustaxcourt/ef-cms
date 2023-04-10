export const petitionsClerkViewsDocketRecordAfterServing = cerebralTest => {
  return it('Petitions clerk views docket record after serving petition on the IRS', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(cerebralTest.getState('caseDetail.docketEntries')).toContainEqual({
      description: 'Filing Fee Paid',
      eventCode: 'FEE',
      filingDate: '2018-12-24T05:00:00.000Z',
      index: 6,
    });
  });
};
