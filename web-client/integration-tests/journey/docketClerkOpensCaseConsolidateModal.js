export const docketClerkOpensCaseConsolidateModal = test => {
  it('Docket clerk opens the consolidation modal', async () => {
    await test.runSequence('openCleanModalSequence', {
      showModal: 'AddConsolidatedCaseModal',
    });
    expect(test.getState('modal.showModal')).toEqual(
      'AddConsolidatedCaseModal',
    );
  });
};
