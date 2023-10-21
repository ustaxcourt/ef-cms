export const getConsolidatedCasesDetails = (cerebralTest, docketNumber) => {
  return it('should set case detail on state for each case in the consolidated cases group', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber,
    });

    const consolidatedCases = cerebralTest.getState(
      'caseDetail.consolidatedCases',
    );

    const consolidatedCaseDetailGroup: RawCase[] = [];
    for (let consolidatedCase of consolidatedCases) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCase.docketNumber,
      });
      consolidatedCaseDetailGroup.push(cerebralTest.getState('caseDetail'));
    }

    cerebralTest.consolidatedCaseDetailGroup = consolidatedCaseDetailGroup;
  });
};
