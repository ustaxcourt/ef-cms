export const petitionsClerkAddsOtherStatisticsToCase = test => {
  return it('petitions clerk adds other statistics to case', async () => {
    await test.runSequence('gotoAddOtherStatisticsSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddOtherStatistics');

    await test.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 1234,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'damages',
      value: 5678,
    });

    await test.runSequence('submitAddOtherStatisticsSequence');

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('caseDetail')).toMatchObject({
      damages: 5678,
      litigationCosts: 1234,
    });
  });
};
