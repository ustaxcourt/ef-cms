export const docketClerkOpensCaseConsolidateModal = cerebralTest => {
  it('Docket clerk opens the consolidation modal', async () => {
    await cerebralTest.runSequence('openCleanModalSequence', {
      showModal: 'AddConsolidatedCaseModal',
    });
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'AddConsolidatedCaseModal',
    );
  });
};
