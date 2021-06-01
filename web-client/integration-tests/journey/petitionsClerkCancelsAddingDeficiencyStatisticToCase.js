export const petitionsClerkCancelsAddingDeficiencyStatisticToCase = test => {
  return it('Petitions clerk cancels adding deficiency statistic to case', async () => {
    await test.runSequence('gotoAddDeficiencyStatisticsSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('AddDeficiencyStatistics');

    await test.runSequence('cancelAddStatisticSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(
      test.getState('currentViewMetadata.caseDetail.caseInformationTab'),
    ).toEqual('statistics');
  });
};
