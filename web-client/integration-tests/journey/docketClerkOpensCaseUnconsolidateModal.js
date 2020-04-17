export const docketClerkOpensCaseUnconsolidateModal = test => {
  it('Docket clerk opens the unconsolidate modal', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(test.getState('modal.showModal')).toEqual('UnconsolidateCasesModal');
  });
};
