export const practitionerViewsCaseDetail = (
  cerebralTest,
  isAssociated = true,
) => {
  return it('Practitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    if (isAssociated) {
      expect(cerebralTest.getState('caseDetail.privatePractitioners')).toEqual(
        [],
      );
    }
  });
};
