export const practitionerViewsDashboardBeforeAddingCase = cerebralTest => {
  return it('Practitioner views dashboard before adding the case', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
  });
};
