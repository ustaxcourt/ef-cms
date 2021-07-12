export const docketClerkOpensCaseUnconsolidateModal = cerebralTest => {
  it('Docket clerk opens the unconsolidate modal', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'UnconsolidateCasesModal',
    );
  });
};
