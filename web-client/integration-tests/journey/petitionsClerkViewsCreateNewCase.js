export const petitionsClerkViewsCreateNewCase = test => {
  return it('Petitions clerk views Start Case from Paper (internal Case Journey)', async () => {
    await test.runSequence('gotoStartCaseWizardSequence', {
      step: 1,
      wizardStep: 'StartCaseStep1',
    });

    expect(test.getState('currentPage')).toEqual('StartCaseInternal');
  });
};
