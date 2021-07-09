export const respondentViewsCaseDetail = (
  cerebralTest,
  isAssociated = true,
) => {
  return it('Respondent views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');

    if (isAssociated) {
      expect(cerebralTest.getState('caseDetail.irsPractitioners')).toEqual([]);
    }
  });
};
