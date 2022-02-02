export const practitionerViewsCaseDetail = cerebralTest => {
  return it('Practitioner views case detail', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
