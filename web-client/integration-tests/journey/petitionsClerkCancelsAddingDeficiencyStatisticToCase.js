export const petitionsClerkCancelsAddingDeficiencyStatisticToCase =
  cerebralTest => {
    return it('Petitions clerk cancels adding deficiency statistic to case', async () => {
      await cerebralTest.runSequence('gotoAddDeficiencyStatisticsSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'AddDeficiencyStatistics',
      );

      await cerebralTest.runSequence('cancelAddStatisticSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
      expect(
        cerebralTest.getState(
          'currentViewMetadata.caseDetail.caseInformationTab',
        ),
      ).toEqual('statistics');
    });
  };
