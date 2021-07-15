export const practitionerViewsCaseDetailOfPendingCase = cerebralTest => {
  return it('Practitioner views case detail of owned case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
    expect(cerebralTest.getState('screenMetadata.pendingAssociation')).toEqual(
      true,
    );
  });
};
