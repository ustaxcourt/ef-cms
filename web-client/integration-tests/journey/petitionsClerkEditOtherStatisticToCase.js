export const petitionsClerkEditOtherStatisticToCase = test => {
  return it('petitions clerk edits other statistic on the case', async () => {
    await test.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail.damages')).toEqual(5678);
    expect(test.getState('caseDetail.litigationCosts')).toEqual(1234);

    await test.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 99,
    });

    await test.runSequence('submitEditOtherStatisticsSequence');

    expect(test.getState('caseDetail.litigationCosts')).toEqual(99);
  });
};
