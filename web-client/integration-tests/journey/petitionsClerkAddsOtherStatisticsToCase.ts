export const petitionsClerkAddsOtherStatisticsToCase = cerebralTest => {
  return it('petitions clerk adds other statistics to case', async () => {
    await cerebralTest.runSequence('gotoAddOtherStatisticsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('AddOtherStatistics');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 1234,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'damages',
      value: 5678,
    });

    await cerebralTest.runSequence('submitAddOtherStatisticsSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(cerebralTest.getState('caseDetail')).toMatchObject({
      damages: 5678,
      litigationCosts: 1234,
    });
  });
};
