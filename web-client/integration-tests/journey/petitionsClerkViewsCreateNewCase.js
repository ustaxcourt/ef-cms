export const petitionsClerkViewsCreateNewCase = cerebralTest => {
  return it('Petitions clerk views Start Case from Paper (internal Case Journey)', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence', {
      step: 1,
      wizardStep: 'StartCaseStep1',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseInternal');
  });
};
